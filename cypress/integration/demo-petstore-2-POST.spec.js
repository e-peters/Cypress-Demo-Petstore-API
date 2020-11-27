import inputPet1 from '../fixtures/inputPet1.json'
import inputPet3 from '../fixtures/inputPet3.json'

describe('Demo Cypress API testing - Petstore - POST', () => {

  it('1. POST pet + GET pet - fixed body input', () => {
    var newPetId  // var needed for assigning and asserting in responses

    cy.request({
      method: 'POST',
      url:    '/pet',
      body:   {
        // "id": 0,     // id=0 returns a generated id, which in its turn runs into an error when getting:
                        // https://petstore.swagger.io/v2/pet/9223372036854776000
                        // <apiResponse>
                        //    <message>java.lang.NumberFormatException: For input string: "9223372036854776000"</message>
                        //    <type>unknown</type>
                        // </apiResponse>
        "id": 1,                // optional "" for the keys in the body
        "category": {
          "id": 0,
          "name": "string"
        },
        "name": "Pet-One-Fixed", 
        "photoUrls": [
          "string"
        ],
        "tags": [
          {
            "id": 0,
            "name": "string"
          }
        ],
        "status": "demomodel"     
      }
    })
      // same assertions for test cases 1-4
      .then(response => {
        expect(response).to.have.property('status', 200)
        expect(response.body).to.not.be.null

        // assert new id
        expect(response.body).to.have.property('id')
        newPetId = response.body.id
        cy.log('POST newPetId: '+ newPetId)

        // assert newly added pet from GET api
        cy.request({
          method: 'GET',
          url:    '/pet/'+newPetId
        })
          .then(response => {
            expect(response).to.have.property('status', 200)
            expect(response.body).to.not.be.null
            
            expect(response.body).to.have.property('id', newPetId)
            cy.log('GET id: '+response.body.id, 'POST id: '+newPetId)
            cy.log('GET newPetId: '+ newPetId)
            cy.log('GET newPetName: '+ response.body.name)

            // if needed, write response to file
            // cy.writeFile('cypress/fixtures/outputPet1.json', response.body)
          })
      })
  })

  it('2. POST pet + GET pet - body input with some variables', () => {
    // similar to previous test case, but:
    // instead of fixed input data, get some input data from a variable
    var newPetId    // var needed for assigning and asserting in responses
    var newPet = {  // var containing some properties for the request body
      id: 1,
      name: 'Pet-One',
      status: 'demomodel'
    }

    cy.request({
      method: 'POST',
      url:    '/pet',
      body:   {
        "id": newPet.id,          // from variable
        "category": {
          "id": 0,
          "name": "string"
        },
        "name": newPet.name,      // from variable      
        "photoUrls": [
          "string"
        ],
        "tags": [
          {
            "id": 0,
            "name": "string"
          }
        ],
       "status": newPet.status    // from variable   
      }
    })
      // same assertions for test cases 1-4
      .then(response => {
        expect(response).to.have.property('status', 200)
        expect(response.body).to.not.be.null

        // assert new id
        expect(response.body).to.have.property('id')
        newPetId = response.body.id
        cy.log('POST newPetId: '+ newPetId)

        // assert newly added pet from GET api
        cy.request({
          method: 'GET',
          url:    '/pet/'+newPetId
        })
          .then(response => {
            expect(response).to.have.property('status', 200)
            expect(response.body).to.not.be.null
            
            expect(response.body).to.have.property('id', newPetId)
            cy.log('GET id: '+response.body.id, 'POST id: '+newPetId)
            cy.log('GET newPetId: '+ newPetId)
            cy.log('GET newPetName: '+ response.body.name)
          })
      })
  })

  it('3. POST pet + GET pet - body input from file with 1 pet', () => {
    // similar to previous test case, but:
    // instead of fixed input data or input data from a variable
    // input data from a file containing 1 pet
    var newPetId
    var newPet = inputPet1  // file which is imported at the top of the file; contains 1 pet

    cy.log('newPet: '+newPet.id, newPet.name)
    
    // same request for test cases 3 and 4
    cy.request({
      method: 'POST',
      url:    '/pet',
      body:   newPet
    })
      // same assertions for test cases 1-4
      .then(response => {
        expect(response).to.have.property('status', 200)
        expect(response.body).to.not.be.null

        // assert new id
        expect(response.body).to.have.property('id')
        newPetId = response.body.id
        cy.log('POST newPetId: '+ newPetId)

        // assert newly added pet from GET api
        cy.request({
          method: 'GET',
          url:    '/pet/'+newPetId
        })
          .then(response => {
            expect(response).to.have.property('status', 200)
            expect(response.body).to.not.be.null
            
            expect(response.body).to.have.property('id', newPetId)
            cy.log('GET id: '+response.body.id, 'POST id: '+newPetId)
            cy.log('GET newPetId: '+ newPetId)
            cy.log('GET newPetName: '+ response.body.name)
          })
      })
  })

  it('4. POST pets + GET pets - body input from file with 3 pets', () => {
    // similar to previous test case, but:
    // instead of fixed input data or input data from a variable
    // input data from a file containing 3 pets
    // and loop through these inputs
    var newPetId
    var newPets = inputPet3  // file which is imported at the top of the file; contains 3 pets

    // only difference with previous test case: a loop around the request
    newPets.forEach(newPet => {
      cy.log('newPet: '+ newPet.name) 

      // same request for test cases 3 and 4
      cy.request({
        method: 'POST',
        url:    '/pet',
        body:   newPet
      })
        .then(response => {
          expect(response).to.have.property('status', 200)
          expect(response.body).to.not.be.null
          
          // assert new id
          expect(response.body).to.have.property('id')
          newPetId = response.body.id
          cy.log('POST newPetId: '+ newPetId)
          
          // assert newly added pet from GET api
          cy.request({
            method: 'GET',
            url:    '/pet/'+newPetId
          })
            .then(response => {
              expect(response).to.have.property('status', 200)
              expect(response.body).to.not.be.null

              expect(response.body).to.have.property('id', newPetId)
              cy.log('GET id: '+response.body.id, 'POST id: '+newPetId)
              cy.log('GET newPetId: '+ newPetId)
              cy.log('GET newPetName: '+ response.body.name)
            })
        })
    })
  })

  it('5. POST order + GET order - add order and get order', () => {
    // add an order and validate the order
    var orderPetId = 1
    var newOrderID = 123

    cy.log('orderPetId: '+ orderPetId)
    cy.request({
      method: 'POST',
      url:    '/store/order',
      body:   {
        "id"      : newOrderID,
        "petId"   : orderPetId,
        "quantity": 1,
        "shipDate": "2020-11-25T20:30:40.500Z",
        "status"  : "placed",
        "complete": true
      }
    })
      .then(response => {
        expect(response).to.have.property('status', 200)
        expect(response.body).to.not.be.null

        expect(response.body).to.have.property('id', newOrderID)
        cy.log('POST orderId: '+ newOrderID)
        
        cy.request({
          method: 'GET',
          url:    '/store/order/'+newOrderID
        })
          .then(response => {
            expect(response).to.have.property('status', 200)
            expect(response.body).to.not.be.null

            expect(response.body).to.have.property('id', newOrderID)
            expect(response.body).to.have.property('petId', orderPetId)
            cy.log('GET orderId: '+ newOrderID, 'GET petId: '+orderPetId)
          })
      })
  })
  
  it('6. GET pets by status - verify #demomodels', () => {
    // similar to 2nd GET it from 1-GET spec
    let inputStatus = 'demomodel'   
    cy.request({
      method: 'GET',
      url:    '/pet/findByStatus',
      qs:     {
        status: inputStatus       
      }
    })
      .then(response => {
        expect(response).to.have.property('status', 200)
        expect(response.body).to.not.be.null

        expect(response.body.length).to.be.eq(5)
      })
  })
})
