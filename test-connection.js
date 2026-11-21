require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

async function main() {
  // Save a new question and return the inserted row
  const { data: savedQuestion, error: saveError } = await supabase
    .from('question_bank')
    .insert({
      question_text: `IDE database demo ${new Date().toISOString()}`,
      category: 'behavioral',
      difficulty: 'beginner'
    })
    .select()
    .single();

  if (saveError) throw saveError;

  console.log('Saved to the central database:');
  console.log(savedQuestion);

  // Retrieve that same row from Supabase by its ID
  const { data: retrievedQuestion, error: readError } = await supabase
    .from('question_bank')
    .select()
    .eq('id', savedQuestion.id)
    .single();

  if (readError) throw readError;

  console.log('\nRetrieved from the central database:');
  console.log(retrievedQuestion);
}

main().catch((error) => {
  console.error('Demo failed:', error.message);
  process.exitCode = 1;
});