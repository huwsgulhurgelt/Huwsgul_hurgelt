import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCarrierSchema, type InsertCarrier } from "@shared/schema";
import { useCreateCarrier } from "@/hooks/use-carriers";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Truck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const createCarrier = useCreateCarrier();

  const form = useForm<InsertCarrier>({
    resolver: zodResolver(insertCarrierSchema),
    defaultValues: {
      phone: "",
      description: "",
      pin: "",
    },
  });

  const onSubmit = (data: InsertCarrier) => {
    createCarrier.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-blue-50 to-transparent" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 rotate-3">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900">Become a Carrier</h2>
            <p className="mt-2 text-slate-600">Join our network and start earning today.</p>
          </div>

          <Card className="border-none shadow-2xl shadow-blue-900/5 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Registration Form</CardTitle>
              <CardDescription>
                All fields are required. Your PIN will be used to edit/delete your post.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9911-XXXX" className="bg-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What can you carry? (e.g., Documents, small packages, groceries)"
                            className="bg-white min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          PIN Code
                          <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="****" 
                            maxLength={4}
                            className="bg-white font-mono tracking-widest text-center text-lg" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Remember this! You need it to edit or delete your post.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold bg-[#ff5e00] hover:bg-[#e65500] text-white shadow-lg shadow-orange-500/20"
                    disabled={createCarrier.isPending}
                  >
                    {createCarrier.isPending ? "Registering..." : "Бүртгүүлэх (Register)"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-slate-400">
            <p>School Project • Prototype v1.0</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
