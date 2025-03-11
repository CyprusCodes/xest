---
id: data-table-custom-actions
title: Data Table Custom Actions
sidebar_label: Data Table Custom Actions
---

# Implementing Edit Actions with Modal Forms in Xest Data Table

This guide demonstrates how to create an edit action with a modal form to update records in Xest Data Table.

## 1. Create the Edit Component

First, create a separate component for the edit functionality:

```typescript:src/components/EditRecordAction/index.tsx
interface EditRecordProps {
    record: {
        id: number;
        name: string;
        email: string;
        // ... other record fields
    };
    onUpdate: () => void;
}

function EditRecordAction({ record, onUpdate }: EditRecordProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: record.name,
        email: record.email,
    });

    const handleUpdate = async () => {
        try {
            await updateRecord(record.id, formData);
            toast.success("Record updated successfully");
            setOpen(false);
            onUpdate(); // Refresh table data
        } catch (error) {
            toast.error("Failed to update record");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Pencil className="h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                        />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

## 2. Add Form Validation

Use Zod to validate the form data:

```typescript:src/components/EditRecordAction/validation.ts
const editSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address")
});

// In your component:
const handleUpdate = async () => {
    const result = editSchema.safeParse(formData);
    if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
    }

    try {
        await updateRecord(record.id, formData);
        // ... rest of the code
    } catch (error) {
        // ... error handling
    }
};
```

## 3. Integrate with Xest Data Table

Add the edit action to your table columns:

```typescript:src/components/YourDataTable/index.tsx
import { useTable } from '@xest-ui/data-table';

function YourDataTable() {
    const { data: { refresh } } = useTable();

    const columns: Col<RecordType>[] = [
        // ... other columns
        {
            title: "Actions",
            render: (record) => (
                <EditRecordAction
                    record={record}
                    onUpdate={refresh}
                />
            ),
        }
    ];

    return (
        <TableProvider
            params={{
                // ... your table configuration
            }}
            columns={columns}
        >
            <DataTable />
        </TableProvider>
    );
}
```

## 4. Add Loading States

Improve user experience by adding loading states:

```typescript
function EditRecordAction({ record, onUpdate }: EditRecordProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateRecord(record.id, formData);
      toast.success("Record updated successfully");
      setOpen(false);
      onUpdate();
    } catch (error) {
      toast.error("Failed to update record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      {/* ... dialog content ... */}
      <DialogFooter>
        <Button onClick={handleUpdate} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
```

## 5. Handle API Integration

Create a service function for the update operation:

```typescript:src/services/records/updateRecord.ts
interface UpdateRecordData {
    name: string;
    email: string;
}

export async function updateRecord(id: number, data: UpdateRecordData) {
    const response = await fetch(`/api/records/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update record');
    }

    return response.json();
}
```

## Best Practices

1. **Form State Management**

   - Initialize form with current record data
   - Handle form changes efficiently
   - Validate before submission

2. **Error Handling**

   - Display validation errors clearly
   - Show API error messages to users
   - Maintain form state on error

3. **UX Considerations**

   - Show loading states during submission
   - Disable form while submitting
   - Close modal on successful update
   - Refresh table data after update

4. **Modal Management**
   - Handle modal open/close states
   - Reset form when modal closes
   - Confirm before closing with unsaved changes

## Complete Example

Here's a full implementation combining all the above concepts:

```typescript:src/components/EditRecordAction/index.tsx
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateRecord } from '@/services/records/updateRecord';

const editSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address")
});

interface EditRecordProps {
    record: {
        id: number;
        name: string;
        email: string;
    };
    onUpdate: () => void;
}

export function EditRecordAction({ record, onUpdate }: EditRecordProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: record.name,
        email: record.email,
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setFormData({
                name: record.name,
                email: record.email,
            });
        }
    }, [open, record]);

    const handleUpdate = async () => {
        const result = editSchema.safeParse(formData);
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        setIsLoading(true);
        try {
            await updateRecord(record.id, formData);
            toast.success("Record updated successfully");
            setOpen(false);
            onUpdate();
        } catch (error) {
            toast.error("Failed to update record");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleUpdate}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```
