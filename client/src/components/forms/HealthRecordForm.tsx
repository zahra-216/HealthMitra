import React, { useState, forwardRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, FileText, Image, Loader2 } from 'lucide-react';

// --- Utility for merging class names ---
const cn = (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(' ');

// =================================================================
// 1. Component Props Interfaces
// =================================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

// =================================================================
// 2. Re-creating the UI components
// =================================================================

const buttonVariants: Record<Required<ButtonProps>['variant'], string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, variant = "primary", disabled, loading, ...props }, ref) => {
  const mergedClassNames = cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-4 py-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    buttonVariants[variant],
    className
  );

  return (
    <button
      className={mergedClassNames}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : children}
    </button>
  );
});
Button.displayName = "Button";

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, helperText, className, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
});
Input.displayName = "Input";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, helperText, className, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, helperText, className, options, placeholder, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
});
Select.displayName = "Select";

// =================================================================
// 3. Health Record Form Component (Main Logic)
// =================================================================

// The Zod schema should reflect the raw input types from the form fields.
const RecordTypes = ['prescription', 'lab_report', 'scan', 'visit_note', 'vital_signs'] as const;
const RecordTypeEnum = z.enum(RecordTypes);

// Define the Zod schema to reflect the raw input type for `tags` (string)
const healthRecordSchema = z.object({
  type: RecordTypeEnum,
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  recordDate: z.string().optional(),
  tags: z.string().optional(),
  hospital: z.string().optional(),
  doctorId: z.string().optional(),
  files: z.any().optional()
});

// Use Zod's inferred type for the input data structure
type FormData = z.infer<typeof healthRecordSchema>;

// Define the type for the final data submitted to the API, where `tags` is an array
interface SubmissionData extends Omit<FormData, 'tags' | 'files'> {
    tags?: string[];
    files?: FileList;
}

interface HealthRecordFormProps {
  onSubmit: (data: SubmissionData) => Promise<void>;
  isLoading: boolean;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({ onSubmit, isLoading }) => {
  // State for file handling
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
        type: 'prescription',
        title: '',
        description: '',
        recordDate: new Date().toISOString().split('T')[0],
        tags: '',
        hospital: '',
        doctorId: ''
    }
  });

  const recordTypeOptions = [
    { value: 'prescription', label: 'Prescription' },
    { value: 'lab_report', label: 'Lab Report' },
    { value: 'scan', label: 'Medical Scan' },
    { value: 'visit_note', label: 'Visit Note' },
    { value: 'vital_signs', label: 'Vital Signs' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files);
      setValue('files', files);
      
      const urls: string[] = [];
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          urls.push(URL.createObjectURL(file));
        }
      });
      setPreviewUrls(urls);
    }
  };

  const removeFile = (index: number) => {
    if (selectedFiles) {
      const dt = new DataTransfer();
      let newUrls: string[] = [...previewUrls];

      Array.from(selectedFiles).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        } else {
            if (file.type.startsWith('image/')) {
                const urlToRemove = URL.createObjectURL(file);
                URL.revokeObjectURL(urlToRemove);

                const urlIndex = newUrls.findIndex(url => url === urlToRemove);
                if (urlIndex > -1) {
                    newUrls.splice(urlIndex, 1);
                }
            }
        }
      });
      
      setSelectedFiles(dt.files);
      setValue('files', dt.files);
      setPreviewUrls(newUrls);
    }
  };

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : undefined;
    
    const submissionData: SubmissionData = {
      type: data.type,
      title: data.title,
      description: data.description,
      recordDate: data.recordDate,
      hospital: data.hospital,
      doctorId: data.doctorId,
      tags: tagsArray,
      files: selectedFiles || undefined
    };

    await onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">New Health Record</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Record Type"
          placeholder="Select record type..."
          options={recordTypeOptions}
          {...register('type')}
          error={errors.type?.message}
          required
        />

        <Input
          label="Record Date"
          type="date"
          {...register('recordDate')}
          error={errors.recordDate?.message}
        />
      </div>

      <Input
        label="Title"
        placeholder="Enter record title..."
        {...register('title')}
        error={errors.title?.message}
        required
      />

      <Textarea
        label="Description"
        placeholder="Enter description..."
        rows={4}
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Hospital/Clinic"
          placeholder="e.g., Colombo General Hospital"
          {...register('hospital')}
          error={errors.hospital?.message}
        />

        <Input
          label="Tags"
          placeholder="e.g., diabetes, heart, medication (comma separated)"
          {...register('tags')}
          error={errors.tags?.message}
          helperText="Separate multiple tags with commas"
        />
      </div>
      
      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Files
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              PNG, JPG, PDF up to 10MB each
            </p>
          </label>
        </div>

        {/* Selected Files List */}
        {selectedFiles && selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Files:</h4>
            <div className="space-y-2">
              {Array.from(selectedFiles).map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="flex items-center">
                    {file.type.startsWith('image/') ? (
                      <Image className="h-4 w-4 text-gray-400 mr-2" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <span className="text-sm text-gray-900 dark:text-gray-100">{file.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Previews:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                         const fileIndex = Array.from(selectedFiles || []).findIndex(f => f.type.startsWith('image/') && previewUrls[index] === URL.createObjectURL(f));
                         if (fileIndex > -1) {
                             removeFile(fileIndex);
                         }
                      }}
                      className="text-white hover:text-red-400"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          Save Record
        </Button>
      </div>
    </form>
  );
};

export default HealthRecordForm;