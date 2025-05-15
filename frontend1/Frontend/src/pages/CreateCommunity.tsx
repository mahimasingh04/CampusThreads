
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRecoilState } from 'recoil';
import { Plus, Trash2, ChevronDown, ChevronUp, Edit } from 'lucide-react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { joinedCommunitiesState, communityRulesState } from '@/store/Atom'
import { Community, RulesForm, } from '@/types';

const formSchema = z.object({
  name: z.string()
    .min(3, 'Community name must be at least 3 characters')
    .max(21, 'Community name must be at most 21 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
  rules: z.array(z.object({
    title: z.string().min(1, 'Rule title is required'),
    description: z.string().optional(),
  }))
    .min(1, 'At least one rule is required')
    .max(10, 'Maximum 10 rules allowed'),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCommunity: React.FC = () => {
  const navigate = useNavigate();
  const [joinedCommunities, setJoinedCommunities] = useRecoilState(joinedCommunitiesState);
  const [communityRules, setCommunityRules] = useRecoilState(communityRulesState);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDescription, setNewRuleDescription] = useState('');
  const [rules, setRules] = useState<Omit<RulesForm, 'id'>[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      rules: [],
    },
  });

  const handleAddRule = () => {
    if (newRuleTitle.trim() && rules.length < 10) {
      const newRule: Omit<RulesForm, 'id'> = {
      title: newRuleTitle.trim(),
      description: newRuleDescription.trim(),
      order: rules.length + 1 // Auto-generate order based on position
    };
      const updatedRules = [
       ...rules, 
       newRule
      ];
      setRules(updatedRules);
      form.setValue('rules', updatedRules);
      setNewRuleTitle('');
      setNewRuleDescription('');
    }
  };

  const handleEditRule = (index: number) => {
    setEditingIndex(index);
    setNewRuleTitle(rules[index].title);
    setNewRuleDescription(rules[index].description || '');
  };

  const handleUpdateRule = () => {
    if (editingIndex !== null && newRuleTitle.trim()) {
      const updatedRules = [...rules];
      updatedRules[editingIndex] = {
        title: newRuleTitle.trim(),
        description: newRuleDescription.trim() || '',
        order: editingIndex + 1 // Retain the order based on the index
      };
      setRules(updatedRules);
      form.setValue('rules', updatedRules);
      setNewRuleTitle('');
      setNewRuleDescription('');
      setEditingIndex(null);
    }
  };

  const handleRemoveRule = (indexToRemove: number) => {
    const updatedRules = rules.filter((_, index) => index !== indexToRemove);
    setRules(updatedRules);
    form.setValue('rules', updatedRules);
    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
      setNewRuleTitle('');
      setNewRuleDescription('');
    }
  };

  const onSubmit = async (values: FormValues) => {
  try {
    // Prepare rules data
    const rulesWithOrder = values.rules.map((rule, index) => ({
      ...rule,
      order: index + 1,
      title: rule.title.trim(),
      description: rule.description ? rule.description.trim() : '',
    }));

    // API call
    const response = await fetch('http://localhost:3000/api/community/createComm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: values.name.trim(),
        description: values.description.trim(),
        rules: rulesWithOrder,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create community');
    }

    // Use the actual response data instead of mock data
    const newCommunity = responseData.data;

    // Update state with the real community data from the server
    setJoinedCommunities(prev => [...prev, newCommunity]);

    // Store community rules
    setCommunityRules(prev => ({
      ...prev,
      [newCommunity.name]: newCommunity.rules || []
    }));

    // Navigate to the new community
    navigate(`/community/${newCommunity.name}`);

  } catch (error) {
    console.error('Error creating community:', error);
    // Better error handling - show specific error messages
    
  }
}
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
                      <div className="space-y-2">
                        <Input
                          placeholder="Rule title"
                          value={newRuleTitle}
                          onChange={(e) => setNewRuleTitle(e.target.value)}
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-600"
                        />
                        <Textarea
                          placeholder="Rule description (optional)"
                          value={newRuleDescription}
                          onChange={(e) => setNewRuleDescription(e.target.value)}
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-600 min-h-20"
                        />
                        <div className="flex gap-2">
                          {editingIndex !== null ? (
                            <Button
                              type="button"
                              onClick={handleUpdateRule}
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Update Rule
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={handleAddRule}
                              className="bg-slate-700 hover:bg-slate-600"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Rule
                            </Button>
                          )}
                          {editingIndex !== null && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditingIndex(null);
                                setNewRuleTitle('');
                                setNewRuleDescription('');
                              }}
                              className="border-slate-700 text-white hover:bg-slate-700"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {rules.length > 0 && (
                        <div className="bg-slate-900 rounded-md p-4">
                          <h3 className="text-white font-medium mb-3">Community Rules</h3>
                          <Accordion type="multiple" className="space-y-2">
                            {rules.map((rule, index) => (
                              <AccordionItem 
                                key={index} 
                                value={`rule-${index}`}
                                className="border-b border-slate-700 last:border-b-0"
                              >
                                <AccordionTrigger className="py-2 hover:no-underline">
                                  <div className="flex w-full justify-between items-center text-left">
                                    <div className="flex items-center">
                                      <span className="mr-2 text-white">{index + 1}.</span>
                                      <span className="text-white">{rule.title}</span>
                                    </div>
                                    <div className="flex gap-2 ml-2">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditRule(index);
                                        }}
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-amber-400"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveRule(index);
                                        }}
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-300 pl-6 pt-2">
                                  {rule.description || "No description provided."}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      )}
                      
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
