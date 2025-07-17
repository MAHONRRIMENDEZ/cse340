-- 1 Insert the following new record to the account table - Tony, Stark, tony@starkent.com, Iam1ronM@n
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- 2 Modify the Tony Stark record to change the account_type to "Admin".
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';


-- 3 Delete Delete the Tony Stark record from the database.
DELETE FROM account
WHERE account_email = 'tony@starkent.com';


-- 4 update 'the small interiors' to 'a huge interior' 
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior' )
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5 Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.
SELECT 
    inventory.inv_make, 
    inventory.inv_model, 
    classification.classification_name
FROM inventory
INNER JOIN classification 
    ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

--6 updating the inventory img and thumbnail columns
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
