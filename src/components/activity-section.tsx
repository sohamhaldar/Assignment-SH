'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Trash } from "lucide-react";
import { Button } from './ui/button';
import { useDragDrop } from '@/contexts/DragDropContext';
import { Activity} from '@/types/activity';
import { ActivityCard } from './activity-card';
import { ActivityCardCompact } from './activity-card-compact';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import SharePlan from './shareplan';
import ThemeSelector from './theme-selector';
import ExploreNearbySection from './explore-nearby-section';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

function ActivitySection({
  currentColoumnId,
  setActivityModalOpen
}:{
  currentColoumnId?:string,
  setActivityModalOpen?: (isOpen: boolean) => void
}) {
  const { availableActivities, addActivityToColumn, columns, setAvailableActivities, deleteAvailableActivity } = useDragDrop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
    location: ''
  });
  const [openTip, setOpenTip] = useState<null | 'add'>(null);

  
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || target?.isContentEditable;

      if (!isModalOpen && !typing && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsModalOpen(true);
        return;
      }

      if (isModalOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsModalOpen(false);
          return;
        }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          handleAddNewActivity();
          return;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen, newActivity]);

  const categories = [
    { name: 'Wellness', icon: '🧘' },
    { name: 'Food', icon: '🍽️' },
    { name: 'Culture', icon: '🎭' },
    { name: 'Outdoors', icon: '🌲' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Entertainment', icon: '🎬' }
  ];

  const handleAddToColumn = (activity: Activity, columnId: string) => {
    addActivityToColumn(activity, columnId);
  };

  const handleAddNewActivity = () => {
    if (newActivity.title && newActivity.description) {
      const activity: Activity = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...newActivity
      };
      setAvailableActivities(prev => [...prev, activity]);
      setNewActivity({
        title: '',
        description: '',
        duration: '',
        category: '',
        location: ''
      });
      setIsModalOpen(false);
    }
  };

  const onSubmitNewActivity: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    handleAddNewActivity();
  };

  return (
    <div className='h-full w-auto font-mono flex flex-col px-4 py-3 sm:px-4 sm:py-4 md:px-4 md:py-5 lg:px-4 xl:px-6 lg:py-6 overflow-hidden'>
      <div className="flex w-full items-center justify-between gap-2 sm:gap-3 md:gap-2 lg:gap-6 md:flex-col lg:flex-row">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Activities</h1>
        <Popover open={openTip === 'add'} onOpenChange={(o) => setOpenTip(o ? 'add' : null)}>
          <PopoverTrigger asChild onMouseEnter={() => setOpenTip('add')} onMouseLeave={() => setOpenTip(null)}>
            <Button
              variant="outline"
              size="icon"
              aria-label="Add activity (A)"
              className="border-0 bg-primary text-primary-foreground hover:bg-primary/90 md:hidden lg:flex"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4"/>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="center" className="px-2 py-1 text-xs">
            Add activity (A)
          </PopoverContent>
        </Popover>
        <Popover open={openTip === 'add'} onOpenChange={(o) => setOpenTip(o ? 'add' : null)}>
          <PopoverTrigger asChild onMouseEnter={() => setOpenTip('add')} onMouseLeave={() => setOpenTip(null)}>
            <Button
              variant="outline"
              size="icon"
              aria-label="Add activity (A)"
              className="border-0 bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-full lg:w-auto rounded-full md:rounded-full lg:rounded-xl hidden md:flex lg:hidden"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4 md:-ml-2 lg:ml-0"/><span className='text-sm sm:text-base lg:hidden ml-2'>Add</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="center" className="px-2 py-1 text-xs">
            Add activity (A)
          </PopoverContent>
        </Popover>
      </div>
      
      <div className='scrollbar scrollbar-track-transparent pr-1 scrollbar-thumb-primary/70 overflow-y-auto h-[65vh] sm:h-[70vh] md:h-[72vh] lg:h-[80vh] mt-3 sm:mt-4 md:mt-6 hidden lg:block'>
        {availableActivities.map((activity) => (
          <div key={activity.id} className="relative">
            <ActivityCard
              activity={activity}
              onAddToColumn={(columnId) => handleAddToColumn(activity, columnId)}
              columns={columns}
            />
            <Button
              variant="ghost"
              size="sm"
              aria-label="Delete activity"
              className="absolute bottom-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => deleteAvailableActivity(activity.id)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className='scrollbar scrollbar-track-transparent pr-1 scrollbar-thumb-primary/70 overflow-y-auto h-[65vh] sm:h-[70vh] md:h-[72vh] lg:h-[80vh] mt-3 sm:mt-4 md:mt-6 block lg:hidden'>
        {availableActivities.map((activity) => (
          <div key={activity.id} className="relative">
            <ActivityCardCompact
              activity={activity}
              onAddToColumn={(columnId) => handleAddToColumn(activity, columnId)}
              columns={columns}
              currentColoumnId={currentColoumnId}
              setActivityModalOpen={setActivityModalOpen}
              deleteAvailableActivity={deleteAvailableActivity}
            />
            {/* <Button
              variant="ghost"
              size="sm"
              aria-label="Delete activity"
              className="absolute bottom-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => deleteAvailableActivity(activity.id)}
            >
              <Trash className="w-4 h-4" />
            </Button> */}
          </div>
        ))}
      </div>
      <div className='md:flex w-full justify-evenly gap-2 hidden mt-2 lg:hidden'>
        <SharePlan/>
        <ThemeSelector/>
        <ExploreNearbySection/>
      </div>
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="font-mono max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl border-0 shadow-xl bg-popover/95 backdrop-blur-sm">
          <DialogHeader className="text-center space-y-6 pb-2 sm:pb-3 md:pb-4">
            <div className="mx-auto w-14 h-14 bg-muted rounded-2xl flex items-center justify-center ring-1 ring-border/50 drop-shadow-md">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">
                Create Activity
              </DialogTitle>
              <p className="text-sm text-muted-foreground">Design your perfect moment</p>
            </div>
          </DialogHeader>
          
      <form onSubmit={onSubmitNewActivity} className="space-y-4 sm:space-y-5 mt-6 sm:mt-8">
            <div className="group relative">
              <Input
                placeholder="What's the activity?"
                value={newActivity.title}
                onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                className="transition-all duration-200 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-border bg-muted/50 focus:bg-background"
              />
            </div>
            
            <div className="group relative">
              <Input
                placeholder="Tell us more about it..."
                value={newActivity.description}
                onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                className="transition-all duration-200 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-border bg-muted/50 focus:bg-background"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* <div className="group relative">
                <Input
                  placeholder="How long?"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, duration: e.target.value }))}
                  className="border-gray-200 focus:border-gray-400 transition-all duration-200 h-12 px-4 bg-gray-50/50 focus:bg-white rounded-xl"
                />
              </div> */}
        <div className="group relative">
                <Select value={newActivity.category} onValueChange={(value) => setNewActivity(prev => ({ ...prev, category: value }))}>
          <SelectTrigger className="transition-all duration-200 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-border bg-muted/50 focus:bg-background">
                    <SelectValue placeholder="Pick a vibe" />
                  </SelectTrigger>
          <SelectContent className="rounded-xl border-border bg-popover/95 backdrop-blur-sm shadow-xl">
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.name} 
                        value={category.name}
            className="font-mono cursor-pointer rounded-lg my-1 hover:bg-accent focus:bg-accent transition-colors duration-200"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="group relative">
              <Input
                placeholder="Where will this happen?"
                value={newActivity.location}
                onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
        className="transition-all duration-200 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-border bg-muted/50 focus:bg-background"
              />
            </div>
            
            <div className="pt-4 sm:pt-6">
              <Button 
                type="submit"
                className={`w-full h-12 rounded-xl font-medium transition-all duration-200 ${
                  !newActivity.title || !newActivity.description 
          ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground' 
          : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Collection
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ActivitySection;