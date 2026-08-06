-- CreateTable
CREATE TABLE `SparePart` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'GHS',
    `image` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `inStock` BOOLEAN NOT NULL DEFAULT true,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `totalReviews` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `SparePart_category_idx`(`category`),
    INDEX `SparePart_brand_idx`(`brand`),
    INDEX `SparePart_inStock_idx`(`inStock`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TowingVehicle` (
    `id` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tag` VARCHAR(191) NOT NULL DEFAULT 'Economy',
    `towCapacity` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'GHS',
    `image` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `operator` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `experience` VARCHAR(191) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `totalReviews` INTEGER NOT NULL DEFAULT 0,
    `available` BOOLEAN NOT NULL DEFAULT true,
    `location` VARCHAR(191) NOT NULL DEFAULT 'Accra',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `TowingVehicle_location_idx`(`location`),
    INDEX `TowingVehicle_available_idx`(`available`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
