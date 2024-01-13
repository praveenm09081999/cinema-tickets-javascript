import { describe, it } from 'mocha';
import { expect } from 'chai';
import TicketService from './../src/pairtest/TicketService.js';

describe('TicketService', () => {
  it('rejects ticket request with no adult type', () => {
    const ticketBook = new TicketService();
    const accountId = 121523;
    const invalidTicketRequests = [0,2,1];
    expect(() => ticketBook.purchaseTickets(accountId, ...invalidTicketRequests)).to.throw('Tickets must include at least 1 adult');
  });

  it('rejects ticket request with invalid account id', () => {
    const ticketBook = new TicketService();
    const accountId = 'AB23422';
    const invalidTicketRequests = [0,2,1];
    expect(() => ticketBook.purchaseTickets(accountId, ...invalidTicketRequests)).to.throw('accountId must be an integer');
  });

  it('rejects ticket request with invalid count for infants', () => {
    const ticketBook = new TicketService();
    const accountId = 121523;
    expect(() => ticketBook.purchaseTickets(accountId,1,2,'3')).to.throw("Infant count should be a whole number");
    expect(() => ticketBook.purchaseTickets(accountId,1,2,-10)).to.throw("Infant count should be a whole number");
  });

  it('rejects ticket request with more than 20 tickets', () => {
    const ticketBook = new TicketService();
    const accountId = 121523;
    expect(() => ticketBook.purchaseTickets(accountId,10,10,100)).to.throw("Sorry, You cannot purchase more than 20 tickets");
  });

  it('rejects ticket request with invalid count for adults', () => {
    const ticketBook = new TicketService();
    const accountId = 121523;
    expect(() => ticketBook.purchaseTickets(accountId,'A',2,3)).to.throw("Adult count should be a valid number");
    expect(() => ticketBook.purchaseTickets(accountId,...[true,2,3])).to.throw("Adult count should be a valid number");
    expect(() => ticketBook.purchaseTickets(accountId,...[false,2,3])).to.throw("Adult count should be a valid number");
    expect(() => ticketBook.purchaseTickets(accountId,{tickets:[1,2,3]})).to.throw("Adult count should be a valid number");
  });

  it('should not reject ticket request with null count for infants', () => {
    const ticketBook = new TicketService();
    const accountId = 121523;
    expect(() => ticketBook.purchaseTickets(accountId,1,2)).not.to.throw();
    const transactionDetails = ticketBook.purchaseTickets(accountId,10,2)
    expect(transactionDetails.TotalAmount).to.equal(220)
    expect(transactionDetails.TotalNumberOfTickets).to.equal(12)
    expect(transactionDetails.TotalNumberOfSeats).to.equal(12)
  });

  it('book ticket successfully for valid ticket purchase', () => {
    const ticketBook = new TicketService();
    const ticketRequests = [1,2,3];
    const accountId = 121523;
    expect(() => ticketBook.purchaseTickets(accountId, ...ticketRequests)).not.to.throw();
  });

  it('calculates correct amount for valid ticket purchase', () => {
    const ticketBook = new TicketService();
    const ticketRequests = [1,5,3];
    const accountId = 121523;
    const transactionDetails = ticketBook.purchaseTickets(accountId, ...ticketRequests)
    expect(transactionDetails.TotalAmount).to.equal(70);
  });

  it('calculates correct number of tickets for valid ticket purchase', () => {
    const ticketBook = new TicketService();
    const ticketRequests = [2,5,3];
    const accountId = 121523;
    const transactionDetails = ticketBook.purchaseTickets(accountId, ...ticketRequests)
    expect(transactionDetails.TotalNumberOfTickets).to.equal(10);
  });

  it('calculates correct number of seatings for valid ticket purchase', () => {
    const ticketBook = new TicketService();
    const ticketRequests = [4,1,10];
    const accountId = 121523;
    const transactionDetails = ticketBook.purchaseTickets(accountId, ...ticketRequests)
    expect(transactionDetails.TotalNumberOfSeats).to.equal(5);
  });
})