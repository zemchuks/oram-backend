// const entityRoles = require("../models/entities/entityRoles");

const moment = require("moment/moment");


const makeTermSheet = async (doc, transaction) => {
    // const EntityRoles = await entityRoles.getAll()
    let topPosition = 0;
    let leftPosition = 50;
    // draw some text
    // console.log(EntityRoles)

    doc.font("Times-Bold", 20).text('FACILITY TERMSHEET', leftPosition + 150, topPosition += 50);

    doc.font("Times-Bold", 17).text('IMPORTANT NOTICE:', leftPosition, topPosition += 50);

    doc.font("Times-Roman", 14).text("We, [“the financier”] are pleased to provide you with a proposal of indicative terms in respect of the Facility (as defined below). This proposal is intended as a basis for discussions and should not be construed as a contractual offer or a binding commitment by [“the financier”]to arrange or finance the Facility. Any commitment by the [“the financier”]shall be subject to conditions acceptable to it including but not limited to (i) satisfactory due diligence; (ii) receipt of internal credit [and other relevant] approvals; (iii) there being no material adverse change in respect of market conditions, the business or financial condition of the Obligors or Belgium; and (iv) satisfactory documentation. Notwithstanding the above, the provisions of “Costs and Expenses” in this term sheet shall be immediately binding upon execution of this term sheet. [“the financier”] will not be responsible for any losses or damages which any person suffers or incurs because of reliance on or using this term sheet. This term sheet and its contents are intended for the exclusive use of the Borrower(s) and shall not be disclosed by the Borrower(s) to any person other than the Borrower's affiliates and legal and financial advisors for the purposes of the proposed transaction unless the prior written consent of the [“the financier”]is obtained.", leftPosition, topPosition += 30);

    doc.font("Times-Bold", 20).text('PARTIES', leftPosition + 220, topPosition += 300);

    doc.font('Times-Bold', 14).text('Borrower / Applicant: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.keyParties[0]?.parties?.filter((item) => item?.type?.roleName === "Buyer" || item?.type?.roleName === "Seller")?.map(item => item?.name?.details?.name)?.join(", ")}`, leftPosition + 135, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Mandated Lead Arranger and Bookrunner: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.keyParties[0]?.parties?.filter((item) => item?.type?.roleName === "Buyer" || item?.type?.roleName === "Seller")?.map(item => item?.name?.details?.name)?.join(", ")}`, leftPosition + 265, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Key Parties: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.keyParties[0]?.parties?.map(item => item?.name?.details?.name)?.join(", ")}`, leftPosition + 80, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Lenders: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.lenders}`, leftPosition + 55, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('International Facility Agent: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.keyParties[0]?.parties?.filter((item) => item?.type?.roleName === "International Facility Agent")?.map(item => item?.name?.details?.name)?.join(", ")}`, leftPosition + 170, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Local Administrative Agent (“LAA”): ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.keyParties[0]?.parties?.filter((item) => item?.type?.roleName === "Local Administrative Agent")?.map(item => item?.name?.details?.name)?.join(", ")}`, leftPosition + 230, topPosition).moveDown();

    if (transaction?.keyParties[0]?.parties?.filter((item) => item?.type?.roleName === "Local Administrative Agent")?.map(item => item?.name?.details?.name)?.length) {
        doc.font('Times-Bold', 14).text('Role of the LAA: ', leftPosition, topPosition += 25).moveDown();
        doc.font('Times-Roman', 14).text("", leftPosition + 105, topPosition).moveDown();
    }

    doc.addPage();
    topPosition = 0

    doc.font("Times-Bold", 20).text('TERMS OF FACILITY', leftPosition + 170, topPosition += 50);

    doc.font('Times-Bold', 14).text('Facility type: ', leftPosition, topPosition += 50).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.type}`, leftPosition + 80, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Facility Amount: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.amount}`, leftPosition + 105, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Purpose: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text("name", leftPosition + 55, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Final Maturity Date and repayment period: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${moment(transaction?.facility?.finalMaturity).format("YYYY/MM/DD")}`, leftPosition + 265, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Availability Period: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.availabilityPeriod}`, leftPosition + 120, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Repayment: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.repayment}`, leftPosition + 75, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Transaction Structure: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.transactionStructure}`, leftPosition + 140, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Permitted Accounts: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.permittedAccounts}`, leftPosition + 125, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Sources of repayment: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.sourceOfRepayment?.map(item => item?.instrument).join(", ")}`, leftPosition + 135, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Security Documents: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.securityDocuments?.map(item => item?.name).join(", ")}`, leftPosition + 135, topPosition).moveDown();

    doc.font("Times-Bold", 20).text('PRICING', leftPosition + 220, topPosition += 50);

    doc.font('Times-Bold', 14).text('Advisory Fee: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.advisoryFee} %`, leftPosition + 85, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Annual Management Fee: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.managementFee} %`, leftPosition + 160, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Commitment Fee: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.commitmentFee} %`, leftPosition + 115, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Agency Fee: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.agencyFee} %`, leftPosition + 75, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Margin: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.margin} %`, leftPosition + 55, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Interest Periods: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.interestPeriod}`, leftPosition + 105, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Interest Rate: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.interestRate} %`, leftPosition + 85, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Default Interest: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.defaultInterest} %`, leftPosition + 105, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Documentation: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.documentation}`, leftPosition + 100, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Prepayment: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.prePayment} %`, leftPosition + 80, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Cancellation fees: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.cancellationFee} %`, leftPosition + 110, topPosition).moveDown();

    doc.addPage();
    topPosition = 0

    doc.font('Times-Bold', 14).text('Representations: ', leftPosition, topPosition += 50).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.representations}`, leftPosition + 105, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Information Undertakings: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.informationCovenants}`, leftPosition + 165, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('General Undertakings: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.generalUndertakings}`, leftPosition + 140, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Transaction and Permitted Account Undertakings: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.financialCovenants}`, leftPosition + 305, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Events of Default: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.eventsOfDefault}`, leftPosition + 115, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Conditions Precedent: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.conditionsPrecedent}`, leftPosition + 135, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Assignments and Transfers: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.assignments}`, leftPosition + 170, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Taxes & other Deductions: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.taxationDuties}`, leftPosition + 165, topPosition).moveDown();

    doc.font("Times-Bold", 20).text('MISCELLANEOUS', leftPosition + 170, topPosition += 50);


    doc.font('Times-Bold', 14).text('Miscellaneous Provisions: ', leftPosition, topPosition += 50).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.miscellaneousProvisions}`, leftPosition + 155, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Costs and Expenses: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.expenses}`, leftPosition + 125, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Governing Law: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.governingLaw}`, leftPosition + 100, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Enforcement (Courts): ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text(`${transaction?.facility?.jurisdiction}`, leftPosition + 140, topPosition).moveDown();

    doc.font("Times-Roman", 14).text("You should please indicate, at your earliest convenience, the acceptance of the above terms and conditions by countersigning and returning this document to [“the financier”]no later than end of business on [date].", leftPosition, topPosition += 30);
    doc.font("Times-Roman", 14).text("For and on behalf of [“the financier”]", leftPosition, topPosition += 60);

    doc.font('Times-Bold', 14).text('Name: ', leftPosition, topPosition += 35).moveDown();
    doc.font('Times-Roman', 14).text("...................", leftPosition + 50, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Designation: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text("...................", leftPosition + 90, topPosition).moveDown();

    doc.addPage();
    topPosition = 0;

    doc.font("Times-Roman", 14).text("Accepted on behalf [“the borrower”]", leftPosition, topPosition += 50);

    doc.font('Times-Bold', 14).text('By: ', leftPosition, topPosition += 35).moveDown();
    doc.font('Times-Roman', 14).text("...................", leftPosition + 30, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Designation: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text("...................", leftPosition + 90, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Date: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text("...................", leftPosition + 40, topPosition).moveDown();

    doc.font("Times-Roman", 14).text("Accepted on behalf of the Local Administrative Agent", leftPosition, topPosition += 50);

    doc.font('Times-Bold', 14).text('By: ', leftPosition, topPosition += 35).moveDown();
    doc.font('Times-Roman', 14).text("...................", leftPosition + 30, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Designation: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text("...................", leftPosition + 90, topPosition).moveDown();

    doc.font('Times-Bold', 14).text('Date: ', leftPosition, topPosition += 25).moveDown();
    doc.font('Times-Roman', 14).text("...................", leftPosition + 40, topPosition).moveDown();

    // end and display the document in the iframe to the right
    doc.end();
}

module.exports = makeTermSheet;