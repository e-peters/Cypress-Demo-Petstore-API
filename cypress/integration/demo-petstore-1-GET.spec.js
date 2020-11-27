describe('Demo Cypress API testing - Petstore - GET', () => {

  var inventory = []
  
  it('1. GET inventory - assertions', () => {
    cy.request({
      method: 'GET',
      url:    '/store/inventory'
    })
      .then(response => {
        expect(response.status).to.eql(200)
        expect(response.body).to.not.be.null

        // for debugging purposes
        cy.log('-no-loop- fixed statuses')
        cy.log('available: '+ response.body.available)
        cy.log('pending: '+ response.body.pending)
        cy.log('sold: '+ response.body.sold)
        // // cy.log('demomodel: '+ (isNaN(response.body.demomodel)?0:response.body.demomodel)) // demomodel not always present

        // to be used in next test case: inventory to be validated
        inventory.push(response.body.available)
        inventory.push(response.body.pending)
        inventory.push(response.body.sold)
        // inventory.push(isNaN(response.body.demomodel)?0:response.body.demomodel) // demomodel not always present
        cy.log('inventory: ' + inventory) 
        
        // // for-loop to log all indexes of statuses and inventory from array
        cy.log('-for-loop- array')
        for(var i in inventory) {
          cy.log('index: '+ i, inventory[i])
        }
        
        // // for-loop to log all statuses and inventory from response
        cy.log('-for-loop- response')
        for(var status in response.body) {
          cy.log('status: '+ status, response.body[status])
        }
      })
  })
  
  it('2. GET pets by status - "sold"', () => {
    cy.log('inventory: ' + inventory) 
    // cy.request('GET', '/pet/findByStatus?status=sold')
    let inputStatus = 'sold'   // variable status to be more flexible
    cy.request({
      method: 'GET',
      url:    '/pet/findByStatus',
      qs:     {
        // status: 'sold'        // fixed status
        status: inputStatus   // variable status to be more flexible
      }
    })
      .then(response => {
        expect(response).to.have.property('status', 200)
        expect(response.body).to.not.be.null

        expect(response.body.length).to.be.gte(0)
        expect(response.body.length).to.be.eql(inventory[2])   // fixed status/index in inventory array

        // expect(response.body[0].status).to.be.eql('sold')      // fixed status
        expect(response.body[0].status).to.be.eql(inputStatus)    // variable status, index unknown
      })
  })
  
  var statuses = ['available', 'pending', 'sold']
  // var statuses = ['available', 'pending', 'sold', 'demomodel'] // demomodel not present before posts
  
  it('3. GET pets by status - loop through array', () => {
    // loops through all stored statuses
    // and asserts the number of stored inventory > 0
    cy.log('inventory: ' + inventory) 
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

  it.only('5. GET inventory + GET pets by status - loop through response + validate inventory', () => {
    // gets the number of live inventory for ALL present statuses from the api
    cy.request({
      method: 'GET',
      url:    '/store/inventory'
    })
      .then(response => {
        cy.log(response.body)
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
