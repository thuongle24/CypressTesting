@browser
@search
Feature: Home page
    
    @TC-01
    Scenario Outline: user is able to search weather in city in multiple languages 
        Given I am on the Home page
        When I search the weather in "<city>"
        Then the search "<result>" shows correspondingly

        Examples:
            | city          | result            |
            | New York City | New York City, US |
            #| 大阪市         | Osaka, JP         |
            #| กรุงเทพมหานคร  | Bangkok, TH       |
            #| 上海市         | Shanghai, CN      |
            #| القاهرة       | Cairo, EG         |

    Scenario: user receives a result not found notification when input invalid city
        Given I am on the Home page
        When I search the weather with invalid city
        Then the not-found content is displayed
        And the no-result notification widget is displayed

    # Scenario: locate current location
    #     Given I am on the Home page
    #     When I locate my location
    #     Then the search "Ho Chi Minh City, VN" shows correspondingly

    @TC-02
    Scenario: user is able to switch betwween celsius and fahrenheit metric
        Given I am on the Home page
        When I search the weather in "New York City"
        Then the weather info should be displayed correctly