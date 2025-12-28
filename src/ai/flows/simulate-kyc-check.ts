'use server';
/**
 * @fileOverview Simulates a KYC check using an LLM to determine if a user's provided information is sufficient for KYC approval.
 *
 * - simulateKYCCheck - A function that initiates the KYC simulation process.
 * - SimulateKYCCheckInput - The input type for the simulateKYCCheck function.
 * - SimulateKYCCheckOutput - The return type for the simulateKYCCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateKYCCheckInputSchema = z.object({
  userId: z.string().describe('The ID of the user undergoing KYC check.'),
  name: z.string().describe('The full name of the user.'),
  address: z.string().describe('The address of the user.'),
  dob: z.string().describe('The date of birth of the user (YYYY-MM-DD).'),
  governmentId: z.string().describe('The government-issued ID number of the user.'),
});
export type SimulateKYCCheckInput = z.infer<typeof SimulateKYCCheckInputSchema>;

const SimulateKYCCheckOutputSchema = z.object({
  isApproved: z.boolean().describe('Whether the KYC check is approved or not.'),
  reason: z.string().describe('The reason for approval or rejection.'),
});
export type SimulateKYCCheckOutput = z.infer<typeof SimulateKYCCheckOutputSchema>;

export async function simulateKYCCheck(input: SimulateKYCCheckInput): Promise<SimulateKYCCheckOutput> {
  return simulateKYCCheckFlow(input);
}

const kycCheckPrompt = ai.definePrompt({
  name: 'kycCheckPrompt',
  input: {schema: SimulateKYCCheckInputSchema},
  output: {schema: SimulateKYCCheckOutputSchema},
  prompt: `You are an expert KYC (Know Your Customer) analyst.
  Based on the user's provided information, determine whether the KYC check should be approved or rejected.
  Consider factors such as completeness of information, consistency, and any red flags.

  User Details:
  - Name: {{{name}}}
  - Address: {{{address}}}
  - Date of Birth: {{{dob}}}
  - Government ID: {{{governmentId}}}

  Respond with a JSON object containing:
  - isApproved (boolean): true if approved, false if rejected.
  - reason (string): A brief explanation for the decision.
  `,
});

const simulateKYCCheckFlow = ai.defineFlow(
  {
    name: 'simulateKYCCheckFlow',
    inputSchema: SimulateKYCCheckInputSchema,
    outputSchema: SimulateKYCCheckOutputSchema,
  },
  async input => {
    const {output} = await kycCheckPrompt(input);
    return output!;
  }
);

