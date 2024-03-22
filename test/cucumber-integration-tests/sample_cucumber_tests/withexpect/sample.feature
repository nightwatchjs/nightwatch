Feature: Sample Feature
@pass
Scenario: Sample Scenario
    Given I navigate to localhost
    Then I check if webdriver is present

@expect
Scenario: Sample Scenario with expect
    Given I navigate to localhost
    Then I check if webdriver is present and contains text

@fail
Scenario: Sample test with failures
    Given I navigate to localhost
    Then I check if badElement is present