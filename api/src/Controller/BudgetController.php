<?php

namespace App\Controller;

use App\Entity\Budget;
use App\Entity\User;
use App\Repository\BudgetRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/budgets')]
class BudgetController extends AbstractController
{
    #[Route('', name: 'api_get_budgets', methods: ['GET'])]
    public function getBudgets(
        #[CurrentUser] ?User $user,
        BudgetRepository     $budgetRepository,
        SerializerInterface  $serializer
    ): JsonResponse
    {
        if (!$user) {
            return $this->json(['message' => 'Authentication required'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $budgetsData = $budgetRepository->findUserBudgetsWithDetails($user);

        return $this->json($budgetsData, 200, [], [
            AbstractNormalizer::GROUPS => ['budget:read', 'transaction:read'],
        ]);
    }

    #[Route('', name: 'api_create_budget', methods: ['POST'])]
    public function createBudget(
        Request                $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface     $validator,
        BudgetRepository       $budgetRepository,
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

        $budget = new Budget();
        $budget->setOwner($user);
        $budget->setCategory($data['category'] ?? null);
        $budget->setMaximumAmount((string)($data['maximumAmount'] ?? null));
        $budget->setTheme($data['theme'] ?? null);


        $allErrorMessages = [];

        $violations = $validator->validate($budget);
        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                $allErrorMessages[$violation->getPropertyPath()][] = $violation->getMessage();
            }
        }


        if (!empty($budget->getCategory()) && !isset($allErrorMessages['category'])) {
            $existingBudget = $budgetRepository->findOneBy(['owner' => $user, 'category' => $budget->getCategory()]);
            if ($existingBudget) {
                $allErrorMessages['category'][] = 'A budget for this category already exists.';
            }
        }

        if (!empty($budget->getTheme()) && !isset($allErrorMessages['theme'])) {
            $existingTheme = $budgetRepository->findOneBy(['owner' => $user, 'theme' => $budget->getTheme()]);
            if ($existingTheme) {
                $allErrorMessages['theme'][] = 'This theme color is already in use by another budget.';
            }
        }

        if (!empty($allErrorMessages)) {
            return $this->json(['errors' => $allErrorMessages], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }


        $entityManager->persist($budget);
        $entityManager->flush();

        $newBudgetDetails = $budgetRepository->getBudgetDetails($budget);

        return $this->json($newBudgetDetails, JsonResponse::HTTP_CREATED, [], [
            AbstractNormalizer::GROUPS => ['budget:read', 'transaction:read'],
        ]);
    }

    #[Route('/{id}', name: 'api_update_budget', methods: ['PUT'])]
    public function updateBudget(
        Budget                 $budget,
        Request                $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface     $validator,
        BudgetRepository       $budgetRepository,
        #[CurrentUser] ?User   $user
    ): JsonResponse
    {
        if (!$user || $budget->getOwner() !== $user) {
            return $this->json(['message' => 'Access Denied.'], JsonResponse::HTTP_FORBIDDEN);
        }

        try {
            $data = $request->toArray();
        } catch (\JsonException $e) {
            return $this->json(['error' => 'Invalid JSON payload'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $allErrorMessages = [];
        $newCategoryName = $data['category'] ?? $budget->getCategory();
        $newTheme = $data['theme'] ?? $budget->getTheme();

        if ($newCategoryName !== $budget->getCategory()) {
            $existingBudget = $budgetRepository->findOneBy(['owner' => $user, 'category' => $newCategoryName]);
            if ($existingBudget) {
                $allErrorMessages['category'][] = 'A budget with this category name already exists.';
            }
        }

        if ($newTheme !== $budget->getTheme()) {
            $existingTheme = $budgetRepository->findOneBy(['owner' => $user, 'theme' => $newTheme]);
            if ($existingTheme) {
                $allErrorMessages['theme'][] = 'This theme color is already in use by another budget.';
            }
        }

        $budget->setCategory($newCategoryName);
        $budget->setMaximumAmount((string)($data['maximumAmount'] ?? $budget->getMaximumAmount()));
        $budget->setTheme($data['theme'] ?? $budget->getTheme());

        $violations = $validator->validate($budget);
        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                $allErrorMessages[$violation->getPropertyPath()][] = $violation->getMessage();
            }
        }

        if (!empty($allErrorMessages)) {
            return $this->json(['errors' => $allErrorMessages], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $entityManager->flush();

        $updatedBudgetDetails = $budgetRepository->getBudgetDetails($budget);

        return $this->json($updatedBudgetDetails, 200, [], [
            AbstractNormalizer::GROUPS => ['budget:read', 'transaction:read'],
        ]);
    }

    #[Route('/{id}', name: 'api_delete_budget', methods: ['DELETE'])]
    public function deleteBudget(
        Budget                 $budget,
        EntityManagerInterface $entityManager,
        #[CurrentUser] ?User   $user
    ): JsonResponse
    {
        if (!$user || $budget->getOwner() !== $user) {
            return $this->json(['message' => 'Access Denied.'], JsonResponse::HTTP_FORBIDDEN);
        }

        $entityManager->remove($budget);
        $entityManager->flush();

        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

}