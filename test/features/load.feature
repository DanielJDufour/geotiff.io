Feature: load

    Scenario: load from file
        Given loaded website
         When click "Choose File"
          And open "16923917253.tif"
          And click "GO"
          And wait 30 seconds
         Then raster appears
