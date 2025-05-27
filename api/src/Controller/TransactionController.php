<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\TransactionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;


#[Route('/api/transactions')]
class TransactionController extends AbstractController
{
    #[Route('', name: 'api_get_transactions', methods: ['GET'])]
    public function getTransactions(
        Request               $request,
        TransactionRepository $transactionRepository,
        SerializerInterface   $serializer,
        #[CurrentUser] ?User  $user
    ): JsonResponse
    {
        if (!$user) {
            return $this->json(['message' => 'Authentication required'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $searchTerm = $request->query->get('search');
        $category = $request->query->get('category');
        $sortBy = $request->query->get('sort_by', 'latest');
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $result = $transactionRepository->findUserTransactionsByFilters(
            $user,
            $searchTerm,
            $category,
            $sortBy,
            $page,
            $limit
        );

        $transactions = $result['items'];
        $totalItems = $result['totalItems'];
        $totalPages = ceil($totalItems / $limit);

        $jsonData = $serializer->serialize($transactions, 'json', [
            AbstractNormalizer::GROUPS => ['transaction:read'],
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object) {
                return $object->getId();
            },
        ]);

        $responsePayload = [
            'items' => json_decode($jsonData, true),
            'pagination' => [
                'currentPage' => $page,
                'itemsPerPage' => $limit,
                'totalItems' => $totalItems,
                'totalPages' => (int)$totalPages,
            ],
        ];

        return new JsonResponse($responsePayload);
    }
}