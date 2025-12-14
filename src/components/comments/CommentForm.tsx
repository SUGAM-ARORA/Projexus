/**
 * Comment Form component - for adding new comments
 */

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { CommentFormData, ValidationError } from '@/types';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateCommentForm, getFieldError } from '@/utils/validation';

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  isLoading?: boolean;
  defaultAuthorEmail?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isLoading = false,
  defaultAuthorEmail = '',
}) => {
  const [formData, setFormData] = useState<CommentFormData>({
    content: '',
    authorEmail: defaultAuthorEmail,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors.find(err => err.field === name)) {
      setErrors(prev => prev.filter(err => err.field !== name));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    const validationErrors = validateCommentForm(formData);
    const fieldError = validationErrors.find(err => err.field === field);
    if (fieldError) {
      setErrors(prev => {
        const filtered = prev.filter(err => err.field !== field);
        return [...filtered, fieldError];
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateCommentForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setTouched({ content: true, authorEmail: true });
      return;
    }

    await onSubmit(formData);
    // Reset form after successful submission
    setFormData({ content: '', authorEmail: defaultAuthorEmail });
    setErrors([]);
    setTouched({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        label="Add a comment"
        name="content"
        value={formData.content}
        onChange={handleChange}
        onBlur={() => handleBlur('content')}
        error={touched.content ? getFieldError(errors, 'content') : undefined}
        placeholder="Write your comment here..."
        rows={3}
        required
      />

      <Input
        label="Your Email"
        name="authorEmail"
        type="email"
        value={formData.authorEmail}
        onChange={handleChange}
        onBlur={() => handleBlur('authorEmail')}
        error={touched.authorEmail ? getFieldError(errors, 'authorEmail') : undefined}
        placeholder="your.email@example.com"
        required
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Post Comment
        </Button>
      </div>
    </form>
  );
};

