Feature: Sample Feature

@fail
Scenario: Sample test with failures
    Given I navigate to localhost
    Then I wait for badElement to be present