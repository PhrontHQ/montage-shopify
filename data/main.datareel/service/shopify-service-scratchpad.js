scratchpad
https://community.airtable.com/t/return-multiple-records-for-linked-table/5954/5

Trips?sort[0][field]=Start Date&sort[0][direction]=asc&filterByFormula=AND(IS_BEFORE(TODAY(),{End Date}),NOT({Trip ID}=''),OR({Registration Status}='active',{Registration Status}='pending'),OR(RECORD_ID()='recdue1JThlUfZAxN', RECORD_ID()='recQonQJr8LSTvVRX', RECORD_ID()='rech8det0nyYKfjHr', RECORD_ID()='recmZsmS5dviRdjtD', RECORD_ID()='recMV0Od7LNtnHKKG', RECORD_ID()='rech4X512symMc5ju', RECORD_ID()='reco5OSWGT5kvl0Q5', RECORD_ID()='rec4pV2zFV5GDux9H', RECORD_ID()='recxCKkNpqoXQRZLz', ... 200+ more..., RECORD_ID()='recqlJ1B4AQfGdAs7'))





curl "https://api.airtable.com/v0/appZ6CEB0Bd9fn7gK/Vendors?id=recj69NKZshWar4m8" \
-H "Authorization: Bearer keypOR745TkuhvJBV"


curl "https://api.airtable.com/v0/appZ6CEB0Bd9fn7gK/Vendors?filterByFormula=OR(RECORD_ID()='recMRaSDIQ7DSKNvo',RECORD_ID()='recj69NKZshWar4m8')" \
  -H "Authorization: Bearer keypOR745TkuhvJBV"



curl "https://api.airtable.com/v0/appZ6CEB0Bd9fn7gK/Vendors?OR(id=rec8116cdd76088af,id=rec245db9343f55e8)" \
  -H "Authorization: Bearer keypOR745TkuhvJBV"


{
  "records": [
    {
      "id": "recMRaSDIQ7DSKNvo",
      "fields": {
        "Catalog Link": "http://www.crateandbarrel.com/",
        "Notes": "Everything you need to outfit your home or office.",
        "Name": "Crate & Barrel",
        "Sales Contact": [
          "rec327G1xr2i2FAC4"
        ],
        "Logo": [
          {
            "id": "att5zcqKlJfogP8f3",
            "url": "https://dl.airtable.com/cr7uQMNAQqdaT2T9A0Oh_Crate-Barrel.png",
            "filename": "Crate-Barrel.png",
            "size": 18057,
            "type": "image/png",
            "thumbnails": {
              "small": {
                "url": "https://dl.airtable.com/dBUPo9fYSf2oSpjqEpCR_small_Crate-Barrel.png",
                "width": 68,
                "height": 36
              },
              "large": {
                "url": "https://dl.airtable.com/gyVK181jRkWnf5BpnG6s_large_Crate-Barrel.png",
                "width": 256,
                "height": 135
              }
            }
          },
          {
            "id": "attDFuZHZW5OrvT48",
            "url": "https://dl.airtable.com/bopiJFiHRCSb7tDFhAne_1686RaXL.jpg",
            "filename": "1686RaXL.jpg",
            "size": 22010,
            "type": "image/jpeg",
            "thumbnails": {
              "small": {
                "url": "https://dl.airtable.com/YqUrZAHTRm6Gt93UqBZp_small_1686RaXL.jpg",
                "width": 48,
                "height": 36
              },
              "large": {
                "url": "https://dl.airtable.com/yvcL4PcHThC1JHs4oYio_large_1686RaXL.jpg",
                "width": 256,
                "height": 192
              }
            }
          }
        ],
        "Product": [
          "recdcFe6aJsizmQpB",
          "recl9oEaIea9v6lXH"
        ]
      },
      "createdTime": "2015-01-27T22:56:32.000Z"
    },
    {
      "id": "recj69NKZshWar4m8",
      "fields": {
        "Catalog Link": "http://www.dwr.com/category/workspace.do",
        "Notes": "We have a high-volume discount to DWR. Provide them with customer ID: 91237 when placing an over-the-phone order to get a 20% discount off the total.",
        "Vendor Phone Number": "(415) 734-9172",
        "Closest Showroom Address": "200 Kansas St.\nSan Francisco, CA 94103",
        "Shipping Details": [
          {
            "id": "attnAnHLHWzKhXZhs",
            "url": "https://dl.airtable.com/36SjGm5Q6uXdOVRHtUVH_dwr_shipping_data.pdf",
            "filename": "dwr_shipping_data.pdf",
            "size": 102014,
            "type": "application/pdf",
            "thumbnails": {
              "small": {
                "url": "https://dl.airtable.com/attnAnHLHWzKhXZhs-28x36.png",
                "width": 28,
                "height": 36
              },
              "large": {
                "url": "https://dl.airtable.com/attnAnHLHWzKhXZhs-256x331.png",
                "width": 256,
                "height": 331
              }
            }
          }
        ],
        "Name": "Design Within Reach",
        "Sales Contact": [
          "rec7GOqTGI3jJwyFK"
        ],
        "Logo": [
          {
            "id": "attQr5Afgpn2UsYv9",
            "url": "https://dl.airtable.com/HmEIhOB0SBCvUp9ZSzRi_Design-within-Reach-logo-2.jpg",
            "filename": "Design-within-Reach-logo-2.jpg",
            "size": 236925,
            "type": "image/jpeg",
            "thumbnails": {
              "small": {
                "url": "https://dl.airtable.com/wqXWhvOLQmij1YF6YP19_small_Design-within-Reach-logo-2.jpg",
                "width": 52,
                "height": 36
              },
              "large": {
                "url": "https://dl.airtable.com/9uXtBbsvRpOoF0FNeaNi_large_Design-within-Reach-logo-2.jpg",
                "width": 256,
                "height": 179
              }
            }
          },
          {
            "id": "atty8QwoQfyx2ljq5",
            "url": "https://dl.airtable.com/x1yQqwkCSLKih4OjOeR7_DWR_StamfordAtNight.jpg",
            "filename": "DWR_StamfordAtNight.jpg",
            "size": 90726,
            "type": "image/jpeg",
            "thumbnails": {
              "small": {
                "url": "https://dl.airtable.com/AAdP1tYoT4mcebEEjkEA_small_DWR_StamfordAtNight.jpg",
                "width": 48,
                "height": 36
              },
              "large": {
                "url": "https://dl.airtable.com/Gyn6CvZ0RnySrJIqYYrf_large_DWR_StamfordAtNight.jpg",
                "width": 256,
                "height": 190
              }
            }
          }
        ],
        "Product": [
          "rec2PWpODv7fxkK0k",
          "rechzeFYyEiVWOBlC",
          "recmaihpLbKCRNRMl",
          "recYWbdt5cDk1er4L",
          "recaEtdmcWHWpNXNw",
          "recNmDmGREmMuFJX9",
          "recaOdFnrRih8YRwS",
          "recpIWnG1pyBAfzYe",
          "rec6raaMoaudFBdTh",
          "recJRP61go0lLSrWn",
          "recupCTN1aKmmIW4D",
          "recOKRzIjfbSwQYC3",
          "recFmtxOV5BAndBD7",
          "recXNJ0T3vTWLJo9t",
          "recVME8WSn1UHUsex",
          "rec1vfHNeqPIQBzIL",
          "recOVIZ4XoUNLMhdn",
          "recUKD01XkNSBVm4o"
        ]
      },
      "createdTime": "2015-01-27T22:56:32.000Z"
    },
    {
      "id": "recmFR2zYw6nKcQWU",
      "fields": {},
      "createdTime": "2018-12-21T08:23:28.000Z"
    }
  ]
}


curl "https://api.airtable.com/v0/appZ6CEB0Bd9fn7gK/Vendors?Vendor?OR(id=recMRaSDIQ7DSKNvo)" \
  -H "Authorization: Bearer keypOR745TkuhvJBV"


