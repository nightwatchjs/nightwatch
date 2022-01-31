Feature: Sample Feature
@pass
Scenario: Sample Scenario
    Given I navigate to localhost
    Then I check if webdriver is present
    And text equal Barn owl

@fail
Scenario: Sample test with failures
    Given I navigate to localhost
    Then I check if badElement is present