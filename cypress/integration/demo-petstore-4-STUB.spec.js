describe('Demo Cypress API testing - Petstore - STUB', () => {

  it('1. NO STUB - findByStatus - response from api for demomodel', () => {
    // 1st test case (NO STUB) added for comparison with 2nd test case (STUB)
    let findStatus = 'demomodel'
    // let findStatus = 'available, pending, sold'
    cy.request({
      method: 'GET',
      url: '/pet/findByStatus',
      qs: {
        status: findStatus
      }
    })
      .then(response => {
        expect(response).to.have.property('status', 200)
        expect(response.body).to.not.be.null

        // // this response can be used as an initial stub file
        // // needs to be modified to satisfy the stubbed expectations
        // cy.writeFile('cypress/fixtures/response.json', response.body) 
      })
  })

  it('2. STUB - findByStatus - response from stub w/ alias for demomodel', () => {
    // stubbed response contains 6 pets, of which 3 are demomodel and 3 are not
    // there is no check on status: findStatus within the stub file
    // the response will be the total stub file
    let findStatus = 'demomodel'  // not needed, is ignored because of the fixed response 

    cy.fixture('responseDemomodel.json').as('stubResponse') // read file from fixtures folder and give it an alias
    cy.server().route({           // cy.route() needs a cy.server() first
      method: 'GET',
      url: '/pet/findByStatus',
      qs: {
        status: findStatus        // not needed; ignored because of the fixed response
      },
      response: '@stubResponse'   // fixed response from the fixture file alias
    })
      .its('response')
      .as('stub')
      .then(stub => {
        expect(stub).to.not.be.null
        expect(stub.length).to.be.eq(6)             // length should equal 6 (from stub file)
        expect(stub[0].id).to.eql(111)              // first entry should equal 111 (from stub file)
        expect(stub[stub.length - 1].id).to.eql(3)  // last entry should equal 3 (from stub file)
      })
  })

  it('3. STUB - findByStatus - fake response status 404', () => {
    // to fake a faulty response status

    // let findStatus = 'demomodel'        // not needed; ignored because of the fixed response
    cy.server().route({
      method: 'GET',
      url: '/pet/findByStatus',
      // qs:     {
      //   status: findStatus              // not needed; ignored because of the fixed response
      // },
      response: {
        "status": 404                  // fixed response
      }
      // response: 'any random response'   // response can be anything
    })
      .its('response')
      .as('stub')
      .then(stub => {
        expect(stub).to.not.be.null
        expect(stub.status).to.eql(404)
      })
  })

})