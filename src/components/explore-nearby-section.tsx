'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Map } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useDragDrop } from '@/contexts/DragDropContext';
import type { Activity } from '@/types/activity';

type PlaceType =
  | 'all'
  | 'restaurant'
  | 'recreation_and_entertainment'
  | 'shopping_mall'
  | 'gym'
  | 'airport';

interface PlaceStructuredFormatting {
  main_text: string;
  secondary_text?: string;
}

interface PlacePrediction {
  place_id: string;
  structured_formatting: PlaceStructuredFormatting;
  types: string[];
  distance_meters?: number;
}

interface ExploreNearbySuccess {
  success: true;
  data: {
    predictions: PlacePrediction[];
  };
}

interface ExploreNearbyFailure {
  success: false;
  message?: string;
}

type ExploreNearbyResponse = ExploreNearbySuccess | ExploreNearbyFailure;

const ExploreNearbySection = () => {
  const [selectedPlaceType, setSelectedPlaceType] = useState<PlaceType>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTip, setOpenTip] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isTriggerVisible, setIsTriggerVisible] = useState(true);
  const { columns, addActivityToColumn } = useDragDrop();
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

  const getUserLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          resolve(coords);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const fetchNearbyPlaces = async (type: PlaceType) => {
    setLoading(true);
    try {
      let coords = userLocation;

      if (!coords) {
        coords = await getUserLocation();
      }

      const response = await fetch(`/api/explorenearby?lat=${coords.lat}&lng=${coords.lng}&types=${type}`);
      const result: ExploreNearbyResponse = await response.json();

      if (result.success) {
        setPlaces(result.data.predictions || []);
        console.log('Fetched places:', result.data.predictions);
      } else {
        console.error('Failed to fetch places:', result.message);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    } finally {
      setLoading(false);
    }
  };

  const onValueChange = (value: PlaceType) => {
    setSelectedPlaceType(value);
    fetchNearbyPlaces(value);
  };

  useEffect(() => {
    const update = () => {
      const el = triggerRef.current;
      setIsTriggerVisible(!!el && el.offsetParent !== null);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', () => update());
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', () => update());
    };
  }, []);

  useEffect(() => {
    if (!targetColumnId && columns.length > 0) {
      setTargetColumnId(columns[0].id);
    }
  }, [columns, targetColumnId]);

  const addPlaceToPlan = (place: PlacePrediction) => {
    if (columns.length === 0) return;
    const colId = targetColumnId ?? columns[0].id;

    const title: string = place?.structured_formatting?.main_text || 'Visit';
    const secondary: string = place?.structured_formatting?.secondary_text || '';
    const types: string[] = Array.isArray(place?.types) ? place.types : [];

    const typeMap: Record<string, string> = {
      restaurant: 'Food',
      cafe: 'Food',
      gym: 'Wellness',
      museum: 'Culture',
      park: 'Outdoors',
      shopping_mall: 'Shopping',
      movie_theater: 'Entertainment',
    };
    const derivedCategory = types.map(t => typeMap[t]).find(Boolean) || 'Outdoors';

    const activity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `Visit ${title}`,
      description: secondary,
      duration: '1 hour',
      category: derivedCategory,
      location: title,
    };

    addActivityToColumn(activity, colId);
  };

  useEffect(() => {
    if (!isTriggerVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
      if (!open && !typing && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        setOpen(true);
      } else if (open && e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isTriggerVisible, open]);

  useEffect(() => {
    if (open) {
      fetchNearbyPlaces(selectedPlaceType);
    }
  }, [open, selectedPlaceType]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Popover open={openTip} onOpenChange={setOpenTip}>
        <PopoverTrigger asChild onMouseEnter={() => setOpenTip(true)} onMouseLeave={() => setOpenTip(false)}>
          <SheetTrigger asChild>
            <div className=" flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 p-2" role="button" aria-label="Explore nearby (X)" ref={triggerRef}>
              <Map className="w-10 h-10 md:w-8 md:h-8 lg:h-10 lg:w-10 text-gray-600 mb-1" />
              <p className="font-mono text-center text-xs text-medium">Explore Nearby</p>
            </div>
          </SheetTrigger>
        </PopoverTrigger>
        <PopoverContent side="top" align="center" className="px-2 py-1 text-xs w-fit font-mono">Explore nearby (X)</PopoverContent>
      </Popover>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-mono tracking-tight mb-2">Places Near You</SheetTitle>
          <SheetDescription>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Filter:</span>
                <Select value={selectedPlaceType} onValueChange={onValueChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="restaurant">Restaurants</SelectItem>
                    <SelectItem value="recreation_and_entertainment">Entertainment</SelectItem>
                    <SelectItem value="shopping_mall">Shopping Mall</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="airport">Airports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Add to day:</span>
                <Select value={targetColumnId ?? undefined} onValueChange={(v) => setTargetColumnId(v)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title?.split('\n')[0]} • {c.title?.split('\n')[1]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="px-4">
          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading nearby places...</p>
            </div>
          )}

          {!loading && places.length > 0 && (
            <div className="space-y-3 overflow-y-auto h-[80vh] font-mono pb-20 scrollbar scrollbar-track-transparent scrollbar-thumb-primary/70">
              {places.map((place, index) => (
                <div key={place.place_id || index} className="border rounded-lg p-3 hover:bg-gray-50">
                  <h3 className="font-semibold text-base">{place.structured_formatting.main_text}</h3>
                  <p className="text-xs text-gray-600 mt-2">{place.structured_formatting.secondary_text}</p>
                  <div className="flex items-center justify-between mt-2 mb-4">
                    <div className="flex flex-wrap gap-1">
                      {place.types.slice(0, 2).map((type) => (
                        <span key={type} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(place.distance_meters ?? 0)}m away</span>
                  </div>
                  <Button size={"sm"} onClick={() => addPlaceToPlan(place)}>Add</Button>
                </div>
              ))}
            </div>
          )}

          {!loading && places.length === 0 && selectedPlaceType !== "all" && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No places found nearby. Try selecting a different category.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
};

export default ExploreNearbySection;