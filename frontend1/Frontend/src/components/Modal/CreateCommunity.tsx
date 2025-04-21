import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { X, ChevronRight, University } from 'lucide-react';
import { communityModalState, communityFormState } from '@/store/atom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function CreateCommunityModal() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useRecoilState(communityModalState);
  const [formData, setFormData] = useRecoilState(communityFormState);
  const [error, setError] = useState('');
  const [newRule, setNewRule] = useState('');

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
    setError('');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        setError('Community name is required');
        return;
      }
      if (formData.name.length < 3) {
        setError('Community name must be at least 3 characters long');
        return;
      }
    } else if (step === 2) {
      if (!formData.description.trim()) {
        setError('Community description is required');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (formData.rules.length === 0) {
      setError('At least one rule is required');
      return;
    }

    try {
      const response = await fetch('/api/community/createComm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create community');
      }

      handleClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[525px] bg-slate-900 border-none text-white" 
      >
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold text-white">
              {step === 1 && "Tell us about your community"}
              {step === 2 && "Add a description"}
              {step === 3 && "Set community rules"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-slate-700/20"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-300">
            {step === 1 && "A name helps people understand what your community is all about."}
            {step === 2 && "A description will help people know what to expect."}
            {step === 3 && "Rules help maintain a healthy community environment."}
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Community name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-300">r/</span>
                  <Input
                    placeholder="rungtacollege"
                    className="pl-8 bg-slate-800 border-none text-white placeholder-slate-400 focus:ring-2 focus:ring-slate-600"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handleClose} 
                  className="text-white border-slate-700 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleNext}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Tell us about your community..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="h-32 bg-slate-800 border-none text-white placeholder-slate-400 focus:ring-2 focus:ring-slate-600"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <University className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">r/{formData.name}</h3>
                    <p className="text-sm text-slate-300">
                      1 member • 1 online
                    </p>
                    <p className="text-sm mt-1 text-white">{formData.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)} 
                  className="text-white border-slate-700 hover:bg-slate-800"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Community Rules <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a rule..."
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRule();
                        }
                      }}
                      className="bg-slate-800 border-none text-white placeholder-slate-400 focus:ring-2 focus:ring-slate-600"
                    />
                    <Button 
                      onClick={handleAddRule}
                      className="bg-white text-slate-900 hover:bg-slate-100"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {formData.rules.map((rule, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-slate-800 p-3 rounded-md"
                    >
                      <span className="text-white">{rule}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRule(index)}
                        className="text-white hover:bg-slate-700/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="text-white border-slate-700 hover:bg-slate-800"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  Create Community
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}