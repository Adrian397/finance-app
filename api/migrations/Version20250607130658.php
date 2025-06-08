<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250607130658 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE budget (id INT AUTO_INCREMENT NOT NULL, category VARCHAR(100) NOT NULL, maximum_amount NUMERIC(10, 2) NOT NULL, theme VARCHAR(50) DEFAULT NULL, owner_id INT NOT NULL, INDEX IDX_73F2F77B7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE budget ADD CONSTRAINT FK_73F2F77B7E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE budget DROP FOREIGN KEY FK_73F2F77B7E3C61F9
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE budget
        SQL);
    }
}
