
import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { communityModalState } from '@/store/Atom';
import { z } from 'zod';
import { useRecoilState } from 'recoil';
import { Plus, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { joinedCommunitiesState } from '@/store/Atom';
import { Community } from '@/types';


// Form validation schema
const formSchema = z.object({
  name: z.string()
    .min(3, 'Community name must be at least 3 characters')
    .max(21, 'Community name must be at most 21 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
    rules: z.array(z.string().min(1, 'Rule cannot be empty'))
    .min(1, 'At least one rule is required')
});

type FormValues = z.infer<typeof formSchema>;

const CreateCommunity: React.FC = () => {
  const navigate = useNavigate();
  const [joinedCommunities, setJoinedCommunities] = useRecoilState(joinedCommunitiesState);
  const [newRule, setNewRule] = useState('');
  const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useRecoilState(communityModalState);
  const [rules, setRules] = useState<string[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      rules: [''],
    },
  });
 
  const handleClose = () => {
    setIsOpen(false);
    form.reset()
    setRules([])
  }

    const handleAddRule = () => {
    if (newRule.trim() && rules.length < 10) {
      setRules([...rules, newRule.trim()]);
      form.setValue('rules', [...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleRemoveRule = (indexToRemove: number) => {
    const updatedRules = rules.filter((_, index) => index !== indexToRemove);
    setRules(updatedRules);
    form.setValue('rules', updatedRules);
  };
  const onSubmit = async (values: FormValues) => {
    // In a real app, this would be an API call
    const token = localStorage.getItem('token'); // or however you store your token
    console.log('Token being sent:', token); // Debug log
    if(values.rules.length === 0) {
        form.setError("rules", { message: "At least one rule is required" });
        return;
    }
    try {
         const response = await fetch('http://localhost:3000/api/community/createComm', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            
            credentials : 'include',
            body: JSON.stringify({
                name : values.name,
                description: values.description,
                rules : values.rules,
            }),
         });

         if(!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to create community');
         }
         
    

    const newCommunity: Community = {
      id: `community-${Date.now()}`,
      name: values.name,
      description: values.description,
      memberCount: 1, // Starting with the creator
      createdAt: new Date().toISOString(),
      avatarUrl: `https://picsum.photos/seed/${values.name}/100`,
    };
    
    // Add to joined communities
    setJoinedCommunities([...joinedCommunities, newCommunity]);
    
    // Navigate to the new community
    navigate(`/r/${values.name}`);
    handleClose()
}catch(error) {
    // Handle the error properly
    if (error instanceof Error) {
        form.setError("root", { message: error.message });
    } else {
        form.setError("root", { message: "An unknown error occurred" });
    }
}
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Create a Community</CardTitle>
          <CardDescription className="text-slate-300">
            Create a new community to share and discuss topics with others
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Community Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="mr-2 text-slate-300">r/</span>
                        <Input 
                          placeholder="communityname" 
                          {...field} 
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-600"
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-slate-400">
                      This cannot be changed later.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What is your community about?" 
                        {...field} 
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-600 min-h-24"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-400">
                      This helps people understand what your community is about.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}

              />

<FormField
                control={form.control}
                name="rules"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white">Community Rules</FormLabel>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a rule..."
                          value={newRule}
                          onChange={(e) => setNewRule(e.target.value)}
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-600"
                        />
                        <Button
                          type="button"
                          onClick={handleAddRule}
                          className="bg-slate-700 hover:bg-slate-600"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {rules.map((rule, index) => (
                          <div key={index} className="flex items-center gap-2 bg-slate-900 p-2 rounded-md">
                            <span className="text-white flex-1">{rule}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleRemoveRule(index)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.rules && (
                        <p className="text-red-400 text-sm">
                          {form.formState.errors.rules.message}
                        </p>
                      )}
                    </div>
                    <FormDescription className="text-slate-400">
                      Add at least one rule to guide your community members.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="border-slate-700 text-white hover:bg-slate-700 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Create Community
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCommunity;