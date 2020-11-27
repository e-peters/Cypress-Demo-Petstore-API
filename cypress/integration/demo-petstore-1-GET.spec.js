describe('Demo Cypress API testing - Petstore - GET', () => {

  var inventory = []  // variable to store some numbers to assert on
  
  it('1. GET inventory - assertions', () => {
    // get the inventory from /store/inventory
    // store the numbers in a variable to assert on later

    cy.request({
      method: 'GET',
      url:    '/store/inventory'
    })
      .then(response => {
        expect(response.status).to.eql(200)
        expect(response.body).to.not.be.null

        expect(response.body).to.have.property('available')
        expect(response.body).to.have.property('pending')
        expect(response.body).to.have.property('sold')

        // for debugging/info purposes
        cy.log('-no-loop- fixed statuses')
        cy.log('available: '+ response.body.available)
        cy.log('pending: '+ response.body.pending)
        cy.log('sold: '+ response.body.sold)
        // optional demomodel; not always present so work around if it is NaN (Not a Number)
        // cy.log('demomodel: '+ (isNaN(response.body.demomodel)?0:response.body.demomodel)) 

        // to be used in next test case: inventory to be asserted
        // push inventory numbers from the statuses to variable inventory
        inventory.push(response.body.available)
        inventory.push(response.body.pending)
        inventory.push(response.body.sold)
        // optional demomodel; not always present so work around if it is NaN (Not a Number)
        // inventory.push(isNaN(response.body.demomodel)?0:response.body.demomodel) // demomodel not always present

        cy.log('inventory: ' + inventory)   // info
        
        // 2 different kinds of for-loops
        // 1st one loops through variable inventory: 3 (or 4) statuses
        // 2nd one loops through response body: all statuses which are present at

        // 1) for-loop to log all indexes of statuses and inventory from array
        cy.log('-for-loop- inventory-array')
        for(var i in inventory) {
          cy.log('index: '+ i, inventory[i])
        }
        
        // 2) for-loop to log all statuses and inventory from response
        cy.log('-for-loop- response')
        for(var status in response.body) {
          cy.log('status: '+ status, response.body[status])
        }
      })
  })
  
  it('2. GET pets by status - "sold"', () => {
    // dependency: inventory from previous test case is needed

    let inputStatus = 'sold'   // variable status to be more flexible in the request
    
    cy.log('inventory: ' + inventory)   
    
    // cy.request('GET', '/pet/findByStatus?status=sold')   // this syntax is valid, but syntax below is more readable
    cy.request({
      method: 'GET',
      url:    '/pet/findByStatus',
      qs:     {
        // status: 'sold'        // fixed status
        status: inputStatus   // variable status to be more flexible, can be used in loops through statuses
      }
    })
      .then(response => {
        expect(response).to.have.property('status', 200)
        expect(response.body).to.not.be.null

        expect(response.body.length).to.be.gte(0)
        expect(response.body.length).to.be.eql(inventory[2])   // fixed status/index in inventory array

        // expect(response.body[0].status).to.be.eql('sold')      // fixed status
        expect(response.body[0].status).to.be.eql(inputStatus)    // variable status
      })
  })
  
  var statuses = ['available', 'pending', 'sold']   // statuses to loop through
  // var statuses = ['available', 'pending', 'sold', 'demomodel'] // demomodel not present before posts
  
  it('3. GET pets by status - loop through array', () => {
    // loops through all stored statuses
    // and asserts the number of stored inventory > 0
    // variable inventory contains the numbers from /store/inventory

    cy.log('inventory: ' + inventory) 

    // loop through statuses and request pets for each
    statuses.forEach(inputStatus => {
      cy.log('-loop- '+inputStatus)

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
          expect(response.body.length).to.be.gt(0)
        })
    })
  })
  
  it('4. GET pets by status - loop through array + validate inventory', () => {
    // loops through all stored statuses
    // and asserts the number of stored inventory against the inventory from the api
    // variable inventory contains the numbers from /store/inventory from a previous test case

    cy.log('inventory: ' + inventory) 

    statuses.forEach((inputStatus, index) => {
      cy.log('-loop- index '+index, inputStatus)
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
          expect(response.body.length).to.be.gte(0)
          expect(response.body.length).to.be.eql(inventory[index])
        })
    })
  })

  it('5. GET inventory + GET pets by status - loop through response + validate inventory', () => {
    // gets the number of live inventory for ALL present statuses from the api
    cy.request({
      method: 'GET',
      url:    '/store/inventory'
    })
      .then(response => {
        cy.log(response.body)

        // loop through all of the statuses from the response
        for(var status in response.body) {
          let numberOfPets = response.body[status]
          cy.log('-loop- validate #' + status + " is " + numberOfPets)
          cy.request({
            method: 'GET',
            url:    '/pet/findByStatus',
            qs:     {
              status: status
            }
          })
            .then(response => {
              expect(response).to.have.property('status', 200)
              expect(response.body).to.not.be.null
              expect(response.body.length).to.be.gte(0)
              expect(response.body.length).to.be.eql(numberOfPets) // fails on statuses having comma's!
            })
        }
      })
  })

})
