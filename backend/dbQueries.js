const createUsersTable = `
CREATE TABLE
    IF NOT EXISTS users (
        user_id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        PRIMARY KEY (user_id)
    );
`;

const insertUsersQuery = `
    INSERT INTO users (
        first_name,
        last_name
    ) VALUES (?, ?);
`;

const createSavedInputsTable = `
CREATE TABLE
    IF NOT EXISTS savedInputs (
        calc_id INT NOT NULL AUTO_INCREMENT,
        -- Retirement Inputs
        rd_currentAge INT,
        rd_retirementAge INT,
        rd_lifeExpectancy INT,
        rd_income INT,
        rd_incomeIncrease FLOAT,
        rd_investReturnRate FLOAT,
        rd_savings INT,
        rd_savingsContribution INT,
        rd_checking INT,
        rd_checkingContribution INT,
        rd_retirementIncomeNeeded INT,
        rd_retirementIncome INT,
        -- Marriage Inputs
        mad_marriageAge INT,
        mad_savings FLOAT,
        mad_checking FLOAT,
        mad_income FLOAT,
        mad_childCostPerYear FLOAT,
        mad_yearsOff INT,
        mad_divorceAge INT,
        mad_included BOOLEAN,
        -- Mortgage Inputs
        md_price INT,
        md_downPayment INT,
        md_term INT,
        md_interest FLOAT,
        md_startAge INT,
        md_priceType VARCHAR(50),
        md_inflation FLOAT,
        md_included BOOLEAN,
        -- Monthly Expenses Inputs
        med_groceryFood INT,
        med_healthInsurance INT,
        med_carInsurance INT,
        med_cellPhonePlan INT,
        med_utilities INT,
        med_subscriptions INT,
        med_transportation INT,
        med_pet INT,
        med_others INT,
        PRIMARY KEY (calc_id)
    );
`;

const insertSavedInputsQuery = `
    INSERT INTO savedInputs (
        -- Retirement Inputs
        rd_currentAge,
        rd_retirementAge,
        rd_lifeExpectancy,
        rd_income,
        rd_incomeIncrease,
        rd_investReturnRate,
        rd_savings,
        rd_savingsContribution,
        rd_checking,
        rd_checkingContribution,
        rd_retirementIncomeNeeded,
        rd_retirementIncome,
        -- Marriage Inputs
        mad_marriageAge,
        mad_savings,
        mad_checking,
        mad_income,
        mad_childCostPerYear,
        mad_yearsOff,
        mad_divorceAge,
        mad_included,
        -- Mortgage Inputs
        md_price,
        md_downPayment,
        md_term,
        md_interest,
        md_startAge,
        md_priceType,
        md_inflation,
        md_included,
        -- Monthly Expenses Inputs
        med_groceryFood,
        med_healthInsurance,
        med_carInsurance,
        med_cellPhonePlan,
        med_utilities,
        med_subscriptions,
        med_transportation,
        med_pet,
        med_others
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

const createUserCalculationsTable = `
CREATE TABLE
    IF NOT EXISTS user_calculations (
        user_id INT NOT NULL,
        calc_id INT NOT NULL,
        PRIMARY KEY (user_id, calc_id),
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
        FOREIGN KEY (calc_id) REFERENCES savedInputs (calc_id) ON DELETE CASCADE
    );
`;

const insertUserCalculationsQuery = `
    INSERT INTO user_calculations (
        user_id,
        calc_id
    ) VALUES (?, ?);
`;

const createCarsTable = `
CREATE TABLE
    IF NOT EXISTS cars (
        car_id INT NOT NULL AUTO_INCREMENT,
        calc_id INT NOT NULL,
        price FLOAT,
        term INT,
        interest FLOAT,
        downPayment FLOAT,
        salesTax FLOAT,
        fees INT,
        startAge INT,
        inflation FLOAT,
        PRIMARY KEY (car_id),
        FOREIGN KEY (calc_id) REFERENCES savedInputs (calc_id) ON DELETE CASCADE
    );
`;

const insertCarsQuery = `
    INSERT INTO cars (
        calc_id,
        price,
        term,
        interest,
        downPayment,
        salesTax,
        fees,
        startAge,
        inflation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

const createChildAgesTable = `
CREATE TABLE
    IF NOT EXISTS childAges (
        child_id INT NOT NULL AUTO_INCREMENT,
        calc_id INT NOT NULL,
        age INT NOT NULL,
        PRIMARY KEY (child_id),
        FOREIGN KEY (calc_id) REFERENCES savedInputs (calc_id) ON DELETE CASCADE
    );
`;

const insertChildAgesQuery = `
    INSERT INTO childAges (
        calc_id,
        age
    ) VALUES (?, ?);
`;

module.exports = {
  createUsersTable,
  insertUsersQuery,
  createSavedInputsTable,
  insertSavedInputsQuery,
  createUserCalculationsTable,
  insertUserCalculationsQuery,
  createCarsTable,
  insertCarsQuery,
  createChildAgesTable,
  insertChildAgesQuery,
};
