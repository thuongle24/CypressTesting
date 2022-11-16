@browser
    Feature: Home page
        
        @home
        Scenario Outline: user is able to search city in multiple languages 
            Given I am on the Home page
            When I search the weather in "<city>"
            Then the search "<result>" shows correspondingly

            Examples:
                | city         | result       |
                | New York     | New York, US |
            #    | 大阪市        | Osaka, JP    |
            #    | กรุงเทพมหานคร | Bangkok, TH  |
            #    | 上海市        | Shanghai, CN |
            #    | القاهرة      | Cairo, EG    |