<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\TransactionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/bills')]
class BillsController extends AbstractController
{
    #[Route('', name: 'api_get_recurring_bills', methods: ['GET'])]
    public function getRecurringBills(
        Request $request,
        TransactionRepository $transactionRepository,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        if (!$user) {
            return $this->json(['message' => 'Authentication required'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $searchTerm = $request->query->get('search');
        $sortBy = $request->query->get('sort_by', 'latest');

        $data = $transactionRepository->findRecurringBillsSummary($user, $searchTerm, $sortBy);

        return $this->json($data);
    }
}