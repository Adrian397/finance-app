<?php

namespace App\Controller;

use App\Entity\Pot;
use App\Entity\User;
use App\Repository\PotRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/pots')]
class PotController extends AbstractController
{
    #[Route('', name: 'api_get_pots', methods: ['GET'])]
    public function getPots(
        #[CurrentUser] ?User $user,
        PotRepository        $potRepository
    ): JsonResponse
    {
        if (!$user) {
            return $this->json(['message' => 'Authentication required'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $potsData = $potRepository->findUserPotsForApi($user);

        return $this->json($potsData);
    }


    #[Route('', name: 'api_create_pot', methods: ['POST'])]
    public function createPot(
        Request                $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface     $validator,
        PotRepository          $potRepository,
        #[CurrentUser] ?User   $user
    ): JsonResponse
    {
        if (!$user) {
            return $this->json(['message' => 'Authentication required'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        try {
            $data = $request->toArray();
        } catch (\JsonException $e) {
            return $this->json(['error' => 'Invalid JSON payload'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $pot = new Pot();
        $pot->setOwner($user);
        $pot->setName($data['name'] ?? null);
        $pot->setTargetAmount((string)($data['targetAmount'] ?? null));
        $pot->setTheme($data['theme'] ?? null);

        $allErrorMessages = [];

        $violations = $validator->validate($pot);
        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                $allErrorMessages[$violation->getPropertyPath()][] = $violation->getMessage();
            }
        }

        if (!empty($pot->getName()) && !isset($allErrorMessages['name'])) {
            $existingPot = $potRepository->findOneBy(['owner' => $user, 'name' => $pot->getName()]);
            if ($existingPot) {
                $allErrorMessages['name'][] = 'A savings pot with this name already exists.';
            }
        }

        if (!empty($allErrorMessages)) {
            return $this->json(['errors' => $allErrorMessages], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $entityManager->persist($pot);
        $entityManager->flush();

        $newPotData = [
            'id' => $pot->getId(),
            'name' => $pot->getName(),
            'currentAmount' => (float)$pot->getCurrentAmount(),
            'targetAmount' => (float)$pot->getTargetAmount(),
            'theme' => $pot->getTheme(),
        ];

        return $this->json($newPotData, JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_delete_pot', methods: ['DELETE'])]
    public function deletePot(
        Pot                    $pot,
        EntityManagerInterface $entityManager,
        #[CurrentUser] ?User   $user
    ): JsonResponse
    {
        if (!$user || $pot->getOwner() !== $user) {
            return $this->json(['message' => 'Access Denied.'], JsonResponse::HTTP_FORBIDDEN);
        }

        $potAmount = (float)$pot->getCurrentAmount();
        $currentBalance = (float)$user->getBalance();
        $newBalance = $currentBalance + $potAmount;
        $user->setBalance((string)$newBalance);

        $entityManager->persist($user);
        $entityManager->remove($pot);
        $entityManager->flush();

        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }


    #[Route('/{id}', name: 'api_update_pot', methods: ['PUT'])]
    public function updatePot(
        Pot                    $pot,
        Request                $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface     $validator,
        PotRepository          $potRepository,
        #[CurrentUser] ?User   $user
    ): JsonResponse
    {
        if (!$user || $pot->getOwner() !== $user) {
            return $this->json(['message' => 'Access Denied.'], JsonResponse::HTTP_FORBIDDEN);
        }

        try {
            $data = $request->toArray();
        } catch (\JsonException $e) {
            return $this->json(['error' => 'Invalid JSON payload'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $allErrorMessages = [];
        $newName = $data['name'] ?? $pot->getName();

        if ($newName !== $pot->getName()) {
            $existingPot = $potRepository->findOneBy(['owner' => $user, 'name' => $newName]);
            if ($existingPot) {
                $allErrorMessages['name'][] = 'A savings pot with this name already exists.';
            }
        }

        $pot->setName($newName);
        $pot->setTargetAmount((string)($data['targetAmount'] ?? $pot->getTargetAmount()));
        $pot->setTheme($data['theme'] ?? $pot->getTheme());

        $violations = $validator->validate($pot);
        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                $allErrorMessages[$violation->getPropertyPath()][] = $violation->getMessage();
            }
        }

        if (!empty($allErrorMessages)) {
            return $this->json(['errors' => $allErrorMessages], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $entityManager->flush();

        $updatedPotData = $potRepository->findUserPotsForApi($user);
        $potToReturn = array_filter($updatedPotData, fn($p) => $p['id'] === $pot->getId());

        return $this->json(reset($potToReturn) ?: null);
    }

    #[Route('/{id}/add', name: 'api_pot_add_money', methods: ['POST'])]
    public function addMoney(
        Pot                    $pot,
        Request                $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface     $validator,
        #[CurrentUser] ?User   $user
    ): JsonResponse
    {
        if (!$user || $pot->getOwner() !== $user) {
            return $this->json(['message' => 'Access Denied.'], JsonResponse::HTTP_FORBIDDEN);
        }

        try {
            $data = $request->toArray();
            $amountToAdd = $data['amount'] ?? null;
        } catch (\JsonException $e) {
            return $this->json(['error' => 'Invalid JSON payload'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $allErrorMessages = [];


        $violations = $validator->validate($amountToAdd, [
            new Assert\NotBlank(['message' => 'Amount cannot be empty.']),
            new Assert\Type(['type' => 'numeric', 'message' => 'Amount must be a valid number.']),
            new Assert\Positive(['message' => 'Amount must be a positive number.']),
        ]);

        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                $allErrorMessages['amount'][] = $violation->getMessage();
            }
        }

        if (!isset($allErrorMessages['amount'])) {
            $amountToAddFloat = (float)$amountToAdd;
            $userBalance = (float)$user->getBalance();
            $potCurrentAmount = (float)$pot->getCurrentAmount();
            $potTargetAmount = (float)$pot->getTargetAmount();

            if ($userBalance < $amountToAddFloat) {
                $allErrorMessages['amount'][] = 'Insufficient balance to add this amount.';
            }

            if (($potCurrentAmount + $amountToAddFloat) > $potTargetAmount) {
                $formattedTarget = number_format($potTargetAmount, 2);
                $allErrorMessages['amount'][] = "This amount would exceed the pot's target of $$formattedTarget.";
            }
        }

        if (!empty($allErrorMessages)) {
            return $this->json(['errors' => $allErrorMessages], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user->setBalance((string)($userBalance - $amountToAddFloat));
        $pot->setCurrentAmount((string)($potCurrentAmount + $amountToAddFloat));

        $entityManager->persist($user);
        $entityManager->persist($pot);
        $entityManager->flush();

        $updatedPotData = [
            'id' => $pot->getId(),
            'name' => $pot->getName(),
            'currentAmount' => (float)$pot->getCurrentAmount(),
            'targetAmount' => (float)$pot->getTargetAmount(),
            'theme' => $pot->getTheme(),
        ];

        return $this->json($updatedPotData);
    }


    #[Route('/{id}/withdraw', name: 'api_pot_withdraw_money', methods: ['POST'])]
    public function withdrawMoney(
        Pot                    $pot,
        Request                $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface     $validator,
        #[CurrentUser] ?User   $user
    ): JsonResponse
    {
        if (!$user || $pot->getOwner() !== $user) {
            return $this->json(['message' => 'Access Denied.'], JsonResponse::HTTP_FORBIDDEN);
        }

        try {
            $data = $request->toArray();
            $amountToWithdraw = $data['amount'] ?? null;
        } catch (\JsonException $e) {
            return $this->json(['error' => 'Invalid JSON payload'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $violations = $validator->validate($amountToWithdraw, [
            new Assert\NotBlank(['message' => 'Amount cannot be empty.']),
            new Assert\Type(['type' => 'numeric', 'message' => 'Amount must be a number.']),
            new Assert\Positive(['message' => 'Amount must be a positive number.']),
        ]);

        if (count($violations) > 0) {
            return $this->json(['errors' => ['amount' => (string)$violations[0]->getMessage()]], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $amountToWithdrawFloat = (float)$amountToWithdraw;
        $potCurrentAmount = (float)$pot->getCurrentAmount();
        $userBalance = (float)$user->getBalance();

        if ($amountToWithdrawFloat > $potCurrentAmount) {
            return $this->json(['errors' => ['amount' => 'Withdrawal amount cannot be greater than the amount in the pot.']], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $pot->setCurrentAmount((string)($potCurrentAmount - $amountToWithdrawFloat));

        $user->setBalance((string)($userBalance + $amountToWithdrawFloat));

        $entityManager->persist($user);
        $entityManager->persist($pot);
        $entityManager->flush();

        $updatedPotData = [
            'id' => $pot->getId(),
            'name' => $pot->getName(),
            'currentAmount' => (float)$pot->getCurrentAmount(),
            'targetAmount' => (float)$pot->getTargetAmount(),
            'theme' => $pot->getTheme(),
        ];

        return $this->json($updatedPotData);
    }

}