/**
 * @fileoverview This file contains tests & test data for low_volume_skus.
 */

let TEST_PASS_FAIL = { 'PASSED': 0, 'FAILED': 0, 'RAN': 0 };

// Test Data based on customer experiences.
const testData = [
    {
        'PRODUCT_ID_CAPITALISED': true,
        'THRESHOLD': "10",
        'metrics.clicks': "3",
        'segments.product_item_id': 'abcd-12345'
    },
    {
        'PRODUCT_ID_CAPITALISED': true,
        'THRESHOLD': "20",
        'metrics.clicks': "30",
        'segments.product_item_id': 'efgh-67890'
    }
];

const testCases = [
    {
        'id': 'test-clicks-less-than-threshold',
        'want': {
            'result_click': true,
            'result_upper': 'ABCD-12345'
        }
    },
    {
        'id': 'test-clicks-more-than-threshold',
        'want': {
            'result_click': false,
            'result_upper': 'EFGH-67890'
        }
    }
]


/**
 * This function is used to test the output of getFilteredShoppingProducts
 * @param {?object} testCases the test cases defined above.
 * @param {?object} testData the data represented from an ads report query.
 **/
function test_getFilteredShoppingProducts(testCases, testData) {
    var products = [];
    var count = 0;
    while (count < testData.length) {
        var row = testData[count];
        var testRow = testCases[count];
        var PRODUCT_ID_CAPITALISED = row['PRODUCT_ID_CAPITALISED'];
        var THRESHOLD = row['THRESHOLD'];
        var clicks = row['metrics.clicks'];
        var productId = (PRODUCT_ID_CAPITALISED) ?
            row['segments.product_item_id'].toUpperCase() :
            row['segments.product_item_id'];

        // Label product as low volume, if below threshold defined above.
        if (parseInt(clicks) < parseInt(THRESHOLD)) {
            testOutput(testRow.id, true, testRow.want.result_click, 'result click unexpected value.')
            testOutput(testRow.id, (productId == testRow.want.result_upper), true, 'result upper unexpected value.')
            count += 1;
            // Label product as ramped up, if it surpasses expected threshold.
        } else {
            testOutput(testRow.id, false, testRow.want.result_click, 'result click unexpected value')
            testOutput(testRow.id, (productId == testRow.want.result_upper), true, 'result upper unexpected value.')
            count += 1;
        }
    }
}

/**
 * Run this first to begin test cases.
 */
function initTesting() {
    // run test
    test_getFilteredShoppingProducts(testCases, testData);

    // Log test results
    Logger.log(TEST_PASS_FAIL);
}

/**
 * This function is used to test the output of a test. It will print the error
 * if the test fails.
 * @param {string} testCaseId the test case id (bug id) for tracking.
 * @param {?object} actual the value that is present from the test.
 * @param {?object} expected the expected value of the test.
 * @param {string} errif the error that should be shown in logger upon failure.
 *
 * @return {!bool} if the test has successfully passed or not.
 */
function testOutput(testCaseId, actual, expected, errif) {
    Logger.log(`Test - ${testCaseId}: ${actual == expected ? '++PASSED++' : '--FAILED--'}`);

    // log error
    if (actual != expected) {
        TEST_PASS_FAIL['FAILED']++;
        Logger.log(`Error:\n${errif}`);
    } else {
        TEST_PASS_FAIL['PASSED']++;
    }

    Logger.log(`Actual:\n${actual}`);
    Logger.log(`Expected:\n${expected}`);

    TEST_PASS_FAIL['RAN']++;

    return (actual == expected);
}