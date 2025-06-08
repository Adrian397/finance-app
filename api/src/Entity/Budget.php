<?php

namespace App\Entity;

use App\Repository\BudgetRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: BudgetRepository::class)]
class Budget
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['budget:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    #[Assert\NotNull]
    private ?User $owner = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: "Category cannot be empty.")]
    #[Groups(['budget:read', 'budget:write'])]
    private ?string $category = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Assert\NotBlank(message: "Maximum spend cannot be empty.")]
    #[Assert\Type(type: "numeric", message: "Maximum spend must be a valid number.")]
    #[Assert\Positive(message: "Maximum spend must be a positive number.")]
    #[Groups(['budget:read', 'budget:write'])]
    private ?string $maximumAmount = null;


    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['budget:read', 'budget:write'])]
    private ?string $theme = null;

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

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;
        return $this;
    }

    public function getMaximumAmount(): ?string
    {
        return $this->maximumAmount;
    }

    public function setMaximumAmount(string $maximumAmount): static
    {
        $this->maximumAmount = $maximumAmount;
        return $this;
    }

    public function getTheme(): ?string
    {
        return $this->theme;
    }

    public function setTheme(?string $theme): static
    {
        $this->theme = $theme;
        return $this;
    }
}