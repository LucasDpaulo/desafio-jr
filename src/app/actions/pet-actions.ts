"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getPets(searchQuery?: string) {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        OR: searchQuery ? [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { ownerName: { contains: searchQuery, mode: 'insensitive' } },
        ] : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { pets };
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    return { error: "Não foi possível carregar a lista de animais." };
  }
}

export async function createPet(formData: any) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return { error: "Você precisa estar logado para cadastrar um animal." };
  }

  try {
    // 1. Buscamos o ID do usuário através do e-mail da sessão
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return { error: "Usuário não encontrado." };

    // 2. Criamos o pet vinculado a este usuário
    await prisma.pet.create({
      data: {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        ownerName: formData.ownerName,
        ownerContact: formData.ownerContact,
        birthDate: new Date(formData.birthDate), // Convertendo string para Date
        userId: user.id, // Vínculo essencial para a regra de segurança
      },
    });

    // 3. Atualizamos a Home para mostrar o novo pet instantaneamente
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar pet:", error);
    return { error: "Erro ao salvar os dados no banco." };
  }
}

export async function deletePet(petId: string) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return { error: "Não autorizado." };
  }

  try {
    // 1. Buscar o pet para verificar quem é o dono
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) return { error: "Pet não encontrado." };

    // 2. Buscar o ID do usuário logado
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    // 3. Regra de Ouro: Validar se o pet pertence ao usuário
    if (pet.userId !== user?.id) {
      return { error: "Você não tem permissão para excluir este animal." };
    }

    // 4. Exclusão definitiva
    await prisma.pet.delete({
      where: { id: petId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar pet:", error);
    return { error: "Erro ao excluir o pet do banco de dados." };
  }
}
export async function updatePet(petId: string, formData: any) {
  const session = await getServerSession();

  if (!session?.user?.email) return { error: "Não autorizado." };

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const pet = await prisma.pet.findUnique({ where: { id: petId } });

    if (!pet || pet.userId !== user?.id) {
      return { error: "Você não tem permissão para editar este animal." };
    }

    await prisma.pet.update({
      where: { id: petId },
      data: {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        ownerName: formData.ownerName,
        ownerContact: formData.ownerContact,
        birthDate: new Date(formData.birthDate),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao atualizar os dados." };
  }
}