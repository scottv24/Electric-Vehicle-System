CREATE TABLE `chargingPoint` (
  `chargingPointID` int(11) NOT NULL,
  `status` enum('IDLE','BROKEN','CHARGING','RESERVED') DEFAULT NULL,
  `locationID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `chargingPoint` (`chargingPointID`, `status`, `locationID`) VALUES
(1, 'IDLE', 1),
(2, 'IDLE', 1),
(3, 'IDLE', 1),
(4, 'IDLE', 1),
(5, 'IDLE', 1),
(6, 'IDLE', 1),
(7, 'IDLE', 2),
(8, 'IDLE', 2),
(9, 'IDLE', 3),
(10, 'IDLE', 3),
(11, 'IDLE', 3),
(12, 'IDLE', 3),
(13, 'IDLE', 4),
(14, 'IDLE', 4);

CREATE TABLE `keyValues` (
  `maximumPendingTime` int(11) NOT NULL,
  `maximumChargeTime` int(11) NOT NULL,
  `checkQueueInterval` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

CREATE TABLE `location` (
  `locationID` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `wattage` decimal(5,2) DEFAULT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(10,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `location` (`locationID`, `name`, `wattage`, `lat`, `lng`) VALUES
(1, 'Test Location 1', '10', '1', '2'),
(2, 'Test Location 2', '10', '3', '4'),
(3, 'Test Location 3', '20', '5', '6'),
(4, 'Test Location 4', '20', '7', '8'),
(5, 'Test Location 5', '50', '9', '10');

CREATE TABLE `report` (
  `reportID` int(11) NOT NULL,
  `chargingPointID` int(11) NOT NULL,
  `message` varchar(250) DEFAULT NULL,
  `reportTime` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `queue` (
  `locationID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `queueEntryTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `permissionLevel` enum('ADMIN','USER','SUPERADMIN') DEFAULT 'USER',
  `status` enum('WAITING','CHARGING','IDLE','PENDING') DEFAULT 'IDLE',
  `pendingStartTime` timestamp NULL DEFAULT NULL,
  `chargePointID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `users` (`id`, `email`, `permissionLevel`, `status`, `pendingStartTime`, `chargePointID`) VALUES
(1, 'test-user-1', 'USER', 'IDLE', '2024-03-20 12:00:00', NULL),
(2, 'test-user-2', 'USER', 'IDLE', '2024-03-20 12:00:00', NULL),
(3, 'test-user-3', 'USER', 'IDLE', '2024-03-20 12:00:00', NULL),
(4, 'test-user-4', 'USER', 'IDLE', '2024-03-20 12:00:00', NULL),
(5, 'test-user-5', 'USER', 'IDLE', '2024-03-20 12:00:00', NULL),
(6, 'test-user-6', 'USER', 'IDLE', '2024-03-20 12:00:00', NULL),
(7, 'test-superadmin-1', 'SUPERADMIN', 'IDLE', '2024-03-20 12:00:00', NULL),
(8, 'test-admin-1', 'ADMIN', 'IDLE', '2024-03-20 12:00:00', NULL),
(9, 'test-admin-2', 'ADMIN', 'IDLE', '2024-03-20 12:00:00', NULL);

ALTER TABLE `chargingPoint`
  ADD PRIMARY KEY (`chargingPointID`),
  ADD KEY `charging_point_location_fk` (`locationID`);

ALTER TABLE `keyValues`
  ADD PRIMARY KEY (`maximumPendingTime`,`maximumChargeTime`,`checkQueueInterval`);

ALTER TABLE `location`
  ADD PRIMARY KEY (`locationID`);

ALTER TABLE `queue`
  ADD PRIMARY KEY (`locationID`,`userID`),
  ADD KEY `queue_users_fk` (`userID`);

ALTER TABLE `report`
  ADD PRIMARY KEY (`reportID`),
  ADD KEY `charging_point_report_fk` (`chargingPointID`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_chargePoint_fk` (`chargePointID`);

ALTER TABLE `chargingPoint`
  MODIFY `chargingPointID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `location`
  MODIFY `locationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `report`
  MODIFY `reportID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `chargingPoint`
  ADD CONSTRAINT `charging_point_location_fk` FOREIGN KEY (`locationID`) REFERENCES `location` (`locationID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `queue`
  ADD CONSTRAINT `queue_location_fk` FOREIGN KEY (`locationID`) REFERENCES `location` (`locationID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `queue_users_fk` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `report`
  ADD CONSTRAINT `charging_point_report_fk` FOREIGN KEY (`chargingPointID`) REFERENCES `chargingPoint` (`chargingPointID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `users`
  ADD CONSTRAINT `user_chargePoint_fk` FOREIGN KEY (`chargePointID`) REFERENCES `chargingPoint` (`chargingPointID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;