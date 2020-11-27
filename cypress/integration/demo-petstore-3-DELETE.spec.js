describe('Demo Cypress API testing - Petstore - DELETE', () => {

  it('1. BEFORE DELETE - GET pets by status - verify 5 demomodels are left', () => {
    // similar to 2nd GET it from 1-GET spec file
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
  
  it('2. DELETE pets - all demomodels', () => {
    // get all pets with status demomodel
    // delete all these pets
    let findStatus = 'demomodel'

    // get all pets having status = findStatus
    cy.request({
      method: 'GET',
      url:    '/pet/findByStatus',
      qs:     {
        status: findStatus
      }
    })
      .then(response => {
        expect(response).to.have.property('status', 200)
        expect(response.body).to.not.be.null

        // prepare local array with petIds by looping through response.body
        let deletePets    = response.body
        var deletePetIds  = []

        deletePets.forEach(pet => {
          cy.log('-loop- add deletePet to array: '+ pet.id)
          deletePetIds.push(pet.id)
          cy.log('deletePetIds: '+ deletePetIds)
        })

        // delete each pet by looping through array of petIds
        deletePetIds.forEach(deletePetId => {
          cy.log('-loop- call delete api for id '+deletePetId)
          cy.request({
            method: 'DELETE',
            url:    '/pet/'+deletePetId
          })
            .then(response => {
              expect(response).to.have.property('status', 200)
              expect(response.body).to.not.be.null

              // assert specific property in delete response including deleted petId
              expect(response.body).to.have.property('message', deletePetId.toString()) // toString() as assertion is failing when comparing string to integer
            })
        })
      })
  })

  it('3. AFTER DELETE - GET pets by status - verify no demomodels are left', () => {
    // similar to 2nd GET it from 1-GET spec file
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

        expect(response.body.length).to.be.eq(0)
      })
  })
})
