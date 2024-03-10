'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  customerId: z.string(),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid', 'overdue'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const UserSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  profile: z.enum(['admin', 'subcontractor', 'customer', 'builder', 'vendor', 'employee', 'manager'], {
    invalid_type_error: 'Please select a profile.',
  }),
  password: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch(error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch(error) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const CreateUser = UserSchema.omit({ });

// This is temporary until @types/react-dom is updated
export type UserState = {
  errors?: {
    firstname?: string[];
    lastname?: string[];
    profile?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  success?: string | null;
};

export async function createUser(prevState: UserState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateUser.safeParse({
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    profile: formData.get('profile'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if(!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }

  // Prepare data for insertion into the database
  const { firstname, lastname, profile, email, password } = validatedFields.data;
  const fullname = firstname + ' ' + lastname;
  const bcrypt = require('bcrypt');
  let date = new Date();
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - (offset*60*1000));
  const createddate = date.toISOString().split('T')[0];
  const hashedPassword = await bcrypt.hash(password, 10);
  //const id = "410544b2-4001-4271-9855-fec4b6a6442a";
  //const id = Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36);
  console.log(createddate);
  // Insert data into the database
  try {
    await sql`
    INSERT INTO users (firstname, lastname, name, profile, email, password, createddate)
    VALUES (${firstname}, ${lastname}, ${fullname}, ${profile}, ${email}, ${hashedPassword}, ${createddate})
    
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.log('already user');
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }
  // Revalidate the cache for the user page and redirect the user.
  revalidatePath('/createuser');
  return { success: 'User created successfully, navigate to the login page and login'};
}