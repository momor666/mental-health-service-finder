const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Start page', () => {
  it('page title should be \'Find IAPT services - NHS.UK\'', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}`);

    const $ = cheerio.load(res.text);

    expect($('title').text()).to.equal('Find IAPT services - NHS.UK');
    expect($('.local-header--title--question').text()).to.equal('Get help with stress, anxiety or depression');
  });

  it('should be indexed', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}`);
    const $ = cheerio.load(res.text);
    expect($('meta[name=robots]').attr('content')).to.equal(undefined);
  });

  it('should link to the \'Symptoms\' page', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}`);
    const $ = cheerio.load(res.text);
    const symptomsPage = `${constants.siteRoot}/symptoms`;

    expect($('.start-button').attr('href'))
      .to.equal(symptomsPage);
  });

  describe('return to Choices services', () => {
    it('the breadcrumb should have a link back to the Choices IAPT search', async () => {
      const res = await chai.request(server).get(`${constants.siteRoot}`);

      const $ = cheerio.load(res.text);

      expect($($('div.breadcrumb a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
    });

    it('the page should have a link back to the Choices service search', async () => {
      const res = await chai.request(server).get(`${constants.siteRoot}`);

      const $ = cheerio.load(res.text);

      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });
  });
});
