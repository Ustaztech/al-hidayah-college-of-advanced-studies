import { Application } from './types';

export function calculateCompletion(app: Application) {
  let score = 0;
  const steps = {
    personal: false,
    contact: false,
    guardians: false,
    qualifications: false,
    programme: false,
    documents: false
  };

  // Step 1: Personal (needs surname, first_name, state_of_origin, lga_of_origin)
  if (
    app.personal_details &&
    app.personal_details.surname?.trim() &&
    app.personal_details.first_name?.trim() &&
    app.personal_details.state_of_origin?.trim() &&
    app.personal_details.lga_of_origin?.trim()
  ) {
    steps.personal = true;
    score += 17;
  }

  // Step 2: Contact (needs phone_number, residential_address, state_of_residence)
  if (
    app.contact_details &&
    app.contact_details.phone_number?.trim() &&
    app.contact_details.residential_address?.trim() &&
    app.contact_details.state_of_residence?.trim()
  ) {
    steps.contact = true;
    score += 17;
  }

  // Step 3: Guardians (needs at least 1 guardian with full_name & phone)
  if (
    app.guardians &&
    app.guardians.length > 0 &&
    app.guardians[0].full_name?.trim() &&
    app.guardians[0].phone_number?.trim()
  ) {
    steps.guardians = true;
    score += 16;
  }

  // Step 4: Qualifications (needs at least 1 qual with >= 5 subjects)
  if (app.qualifications && app.qualifications.length > 0) {
    const totalSubjects = app.qualifications.reduce((acc, q) => acc + (q.subjects?.length || 0), 0);
    if (totalSubjects >= 5) {
      steps.qualifications = true;
      score += 17;
    }
  }

  // Step 5: Programme Selection
  if (app.admission_programme_id) {
    steps.programme = true;
    score += 16;
  }

  // Step 6: Documents (passport and olevel)
  if (app.documents && app.documents.length > 0) {
    const hasPassport = app.documents.some(d => d.document_type === 'passport_photo');
    const hasOlevel = app.documents.some(d => d.document_type === 'olevel_result');
    if (hasPassport && hasOlevel) {
      steps.documents = true;
      score += 17;
    }
  }

  return { percentage: Math.min(100, score), steps };
}
