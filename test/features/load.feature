Feature: load

    Scenario: load from file
        Given loaded website
         When click "Choose File"
          And wait 1 second
          And click "Search" in "Open File" window
          And wait 1 second
          And type "16923917253.tif" in "Open File" window
          And press enter in "Open File" window
          And press backspace in "Open File" window {10} times
          And click "16923917253.tif" in "Open File" window
          And click "Open" in "Open File" window
          And click "Go"
          And wait 30 seconds
         Then nothing
