import { useState } from "react";
import { type Carrier } from "@shared/schema";
import { useUpdateCarrier, useDeleteCarrier } from "@/hooks/use-carriers";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Edit2, Trash2, KeyRound } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface CarrierCardProps {
  carrier: Carrier;
  index: number;
}

export function CarrierCard({ carrier, index }: CarrierCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Edit State
  const [editPhone, setEditPhone] = useState(carrier.phone);
  const [editDesc, setEditDesc] = useState(carrier.description);
  const [pin, setPin] = useState("");
  
  const updateMutation = useUpdateCarrier();
  const deleteMutation = useDeleteCarrier();

  const handleUpdate = () => {
    updateMutation.mutate(
      { id: carrier.id, phone: editPhone, description: editDesc, pin },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setPin("");
        }
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(
      { id: carrier.id, pin },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setPin("");
        }
      }
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className="h-full border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <span className="bg-muted px-2 py-1 rounded-md">
                  #{carrier.id}
                </span>
                <span>
                  {carrier.createdAt && format(new Date(carrier.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={() => setIsEditOpen(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 text-primary border border-primary/10">
              <Phone className="h-5 w-5" />
              <span className="font-mono font-bold text-lg">{carrier.phone}</span>
            </div>
            <p className="text-foreground/80 leading-relaxed text-sm min-h-[4.5rem]">
              {carrier.description}
            </p>
          </CardContent>
          <CardFooter>
            <a 
              href={`tel:${carrier.phone}`}
              className="w-full"
            >
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all">
                Call Now
              </Button>
            </a>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-primary">Edit Profile</DialogTitle>
            <DialogDescription>
              Enter your PIN to verify identity and update details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pin" className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Verification PIN
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="pl-9 font-mono tracking-widest"
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                />
              </div>
            </div>
            <div className="border-t border-border my-2"></div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdate} 
              disabled={updateMutation.isPending || pin.length < 4}
              className="bg-primary text-white"
            >
              {updateMutation.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive font-display">Delete Profile</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Enter your PIN to confirm deletion.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label htmlFor="delete-pin" className="mb-2 block">Enter PIN to Confirm</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="delete-pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pl-9 font-mono tracking-widest border-destructive/20 focus-visible:ring-destructive"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending || pin.length < 4}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
