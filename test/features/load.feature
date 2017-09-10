Feature: load

    Scenario: load from file
        Given loaded webpage "localhost:8000"
         When click "Choose File"
          And wait 2 seconds
          And open file "16923917253.tif" in browser
          And click "GO"
          And wait 30 seconds
         Then raster appears
