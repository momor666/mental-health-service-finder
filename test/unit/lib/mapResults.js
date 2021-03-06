const chai = require('chai');
const VError = require('verror');

const mapResults = require('../../../app/lib/mapResults');
const types = require('../../../app/lib/constants').types;

const expect = chai.expect;

describe('mapResults', () => {
  Object.keys(types).forEach((type) => {
    describe(`for ${type} type`, () => {
      describe('with valid input', () => {
        it('should return an empty array when there is no \'value\' property', () => {
          const noValue = '{}';
          const results = mapResults(noValue, type, 'nomatch');

          expect(results).to.be.an('array').that.is.empty;
        });

        it('should return the contents of the \'value\' property when there is one', () => {
          const noValue = '{ "value": [] }';
          const results = mapResults(noValue, type, 'nomatch');

          expect(results).to.be.an('array').that.is.empty;
        });
      });
    });

    describe('unknown type', () => {
      it('should throw VError', () => {
        const unknownType = 'unknown';
        expect(() => mapResults('[]', unknownType)).to.throw(VError, `Unable to process results for unknown type: ${unknownType}`);
      });
    });

    describe('with invalid input', () => {
      it('should throw VError when the input is invalid JSON', () => {
        const invalidJson = 'invalid JSON';

        expect(() => mapResults(invalidJson)).to.throw(VError, 'Problem parsing results');
      });
    });
  });

  describe('for GP type', () => {
    const type = types.GP;

    it('should not add a property for \'fullAddress\' when there is no address information', () => {
      const noValue = '{ "value": [{},{}] }';
      const results = mapResults(noValue, type, 'nomatch');

      expect(results).to.be.an('array');
      expect(results.length).to.equal(2);
      results.forEach(item => expect(item.fullAddress).to.be.undefined);
    });

    it('should add a property for \'fullAddress\' when there is address information available', () => {
      const noValue = '{ "value": [{ "Address1": "Address1" },{ "Address1": "Address1" }] }';
      const results = mapResults(noValue, type, 'nomatch');

      expect(results).to.be.an('array');
      expect(results.length).to.equal(2);
      results.forEach(item => expect(item.fullAddress).to.equal('Address1'));
    });
  });

  describe('for IAPT type', () => {
    const type = types.IAPT;

    it('should not add a property for \'email\', \'telephone\' or \'website\' when there information', () => {
      const noValue = '{ "value": [{},{}] }';
      const results = mapResults(noValue, type);

      expect(results).to.be.an('array');
      expect(results.length).to.equal(2);
      results.forEach(item => expect(item.email).to.be.undefined);
      results.forEach(item => expect(item.telephone).to.be.undefined);
      results.forEach(item => expect(item.website).to.be.undefined);
    });

    it('should add a property for \'email\', \'telephone\' or \'website\' when there information', () => {
      const email = 'name@domain.com';
      const telephone = '0800 123 456';
      const website = 'https://a.web.site';
      const contacts = JSON.stringify([
        { OrganisationContactMethodType: 'Telephone', OrganisationContactValue: telephone },
        { OrganisationContactMethodType: 'Email', OrganisationContactValue: email },
        { OrganisationContactMethodType: 'Website', OrganisationContactValue: website },
      ]);
      const noValue = { value: [{ Contacts: contacts }, { Contacts: contacts }] };

      const results = mapResults(JSON.stringify(noValue), type);

      expect(results).to.be.an('array');
      expect(results.length).to.equal(2);
      results.forEach(item => expect(item.email).to.equal(email));
      results.forEach(item => expect(item.telephone).to.equal(telephone));
      results.forEach(item => expect(item.website).to.equal(website));
    });

    it('should remove Sign Health from results', () => {
      const noValue = '{ "value": [{ "NACSCode": "AM701" },{ "NACSCode": "NOT-AM701" }] }';

      const results = mapResults(noValue, type);

      expect(results).to.be.an('array');
      expect(results.length).to.equal(1);
    });
  });
});
