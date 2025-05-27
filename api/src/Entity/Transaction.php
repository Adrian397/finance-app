<?php

namespace App\Entity;

use App\Repository\TransactionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TransactionRepository::class)]
#[ORM\Table(name: '`transaction`')]
class Transaction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['transaction:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    #[Assert\NotNull]
    private ?User $owner = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['transaction:read', 'transaction:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['transaction:read', 'transaction:write'])]
    private ?string $category = null;

    #[ORM\Column(type: Types::DATETIMETZ_IMMUTABLE)]
    #[Assert\NotNull]
    #[Groups(['transaction:read', 'transaction:write'])]
    private ?\DateTimeImmutable $date = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Assert\NotNull]
    #[Groups(['transaction:read', 'transaction:write'])]
    private ?string $amount = null;

    #[ORM\Column(length: 10)]
    #[Assert\Choice(['income', 'expense'])]
    #[Assert\NotBlank]
    #[Groups(['transaction:read', 'transaction:write'])]
    private ?string $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['transaction:read', 'transaction:write'])]
    private ?string $avatar = null;

    #[ORM\Column]
    #[Groups(['transaction:read', 'transaction:write'])]
    private ?bool $isRecurring = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;
        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getAmount(): ?string
    {
        return $this->amount;
    }

    public function setAmount(string $amount): static
    {
        $this->amount = $amount;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): static
    {
        $this->avatar = $avatar;
        return $this;
    }

    public function isIsRecurring(): ?bool
    {
        return $this->isRecurring;
    }

    public function setIsRecurring(bool $isRecurring): static
    {
        $this->isRecurring = $isRecurring;
        return $this;
    }
}