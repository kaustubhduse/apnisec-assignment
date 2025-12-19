import { z } from 'zod';

export const CreateIssueSchema = z.object({
  type: z.enum(['Cloud Security', 'Reteam Assessment', 'VAPT']),
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.string().optional(),
  status: z.string().optional(),
});

export const UpdateIssueSchema = z.object({
  type: z.enum(['Cloud Security', 'Reteam Assessment', 'VAPT']).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
});
