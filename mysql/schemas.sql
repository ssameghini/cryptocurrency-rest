-- CreateTable
CREATE TABLE `currencies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(30) NOT NULL,
    `symbol` VARCHAR(3) NOT NULL,

    UNIQUE INDEX `currencies.symbol_unique`(`symbol`),
    PRIMARY KEY (`id`, `symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_currency` INTEGER NOT NULL,
    `value` DECIMAL(20, 10) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,

    INDEX `id_currency`(`id_currency`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rates` ADD FOREIGN KEY (`id_currency`) REFERENCES `currencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
