"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Search, User, Package, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchClients, searchSKUs, createEnterpriseOrder } from "@/lib/actions/crm";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function NewOrderModal() {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  // Customer State
  const [customerQuery, setCustomerQuery] = React.useState("");
  const [customerResults, setCustomerResults] = React.useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null);

  // Items State
  const [productQuery, setProductQuery] = React.useState("");
  const [productResults, setProductResults] = React.useState<any[]>([]);
  const [orderItems, setOrderItems] = React.useState<any[]>([]);

  // Auto-complete triggers
  React.useEffect(() => {
    const delay = setTimeout(async () => {
      if (customerQuery.length > 1) {
        const res = await searchClients(customerQuery);
        if (res.success) setCustomerResults(res.data);
      } else {
        setCustomerResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [customerQuery]);

  React.useEffect(() => {
    const delay = setTimeout(async () => {
      if (productQuery.length > 1) {
        const res = await searchSKUs(productQuery);
        if (res.success) setProductResults(res.data);
      } else {
        setProductResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [productQuery]);

  const addItem = (sku: any) => {
    if (orderItems.find(i => i.skuId === sku.id)) return;
    setOrderItems([...orderItems, { skuId: sku.id, name: sku.name, code: sku.code, quantity: 1, price: Number(sku.sellPrice) }]);
    setProductQuery("");
    setProductResults([]);
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(i => i.skuId !== id));
  };

  const updateQty = (id: string, qty: number) => {
    setOrderItems(orderItems.map(i => i.skuId === id ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || orderItems.length === 0) return;
    
    setIsPending(true);
    const result = await createEnterpriseOrder({
      clientId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      customerPhone: selectedCustomer.phone,
      userId: "system",
      items: orderItems.map(i => ({ skuId: i.skuId, quantity: i.quantity }))
    });

    if (result.success) {
      setOpen(false);
      setSelectedCustomer(null);
      setOrderItems([]);
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsPending(false);
  };

  const total = orderItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20 uppercase tracking-tighter">
          <Plus className="w-4 h-4" />
          Initialize Order
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100]" />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 m-auto w-full max-w-5xl h-fit max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
              >
                <Dialog.Title className="sr-only">New Enterprise Order</Dialog.Title>
                <Dialog.Description className="sr-only">Process multi-item supply chain execution.</Dialog.Description>

                <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
                  <h2 className="text-xl font-black uppercase tracking-tighter">Supply Chain Execution</h2>
                  <Dialog.Close asChild>
                    <button className="p-2 rounded-full hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                  {/* Left: Customer & Product Selection */}
                  <div className="p-8 border-r border-border space-y-8 overflow-y-auto">
                    {/* Customer Selection */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Customer Entity</label>
                      {!selectedCustomer ? (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            placeholder="Search existing corporate entities..."
                            value={customerQuery}
                            onChange={(e) => setCustomerQuery(e.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-xl py-3 pl-10 pr-4 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                          {customerResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-card border border-border rounded-xl mt-2 shadow-2xl z-50 overflow-hidden">
                              {customerResults.map(c => (
                                <button key={c.id} onClick={() => { setSelectedCustomer(c); setCustomerQuery(""); setCustomerResults([]); }} className="w-full p-4 text-left hover:bg-secondary flex flex-col border-b border-border last:border-0 transition-colors">
                                  <span className="text-sm font-black">{c.name}</span>
                                  <span className="text-[10px] opacity-50">{c.email}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><User className="w-5 h-5" /></div>
                            <div>
                              <p className="text-sm font-black uppercase tracking-tighter">{selectedCustomer.name}</p>
                              <p className="text-[10px] font-bold opacity-50">{selectedCustomer.email}</p>
                            </div>
                          </div>
                          <button onClick={() => setSelectedCustomer(null)} className="text-[10px] font-black text-primary hover:underline">Change</button>
                        </div>
                      )}
                    </div>

                    {/* Product Selection */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Add SKU to Manifest</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          placeholder="Search SKUs by name or code..."
                          value={productQuery}
                          onChange={(e) => setProductQuery(e.target.value)}
                          className="w-full bg-secondary/50 border border-border rounded-xl py-3 pl-10 pr-4 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        {productResults.length > 0 && (
                          <div className="absolute top-full left-0 w-full bg-card border border-border rounded-xl mt-2 shadow-2xl z-50 overflow-hidden">
                            {productResults.map(p => (
                              <button key={p.id} onClick={() => addItem(p)} className="w-full p-4 text-left hover:bg-secondary flex justify-between items-center border-b border-border last:border-0">
                                <div>
                                  <span className="text-sm font-black block">{p.name}</span>
                                  <span className="text-[10px] opacity-50 uppercase font-black">{p.code}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-black">${Number(p.sellPrice).toFixed(2)}</span>
                                  <span className="text-[9px] block opacity-50">{p.quantity} in stock</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Manifest (Order Items) */}
                  <div className="bg-secondary/10 flex flex-col overflow-hidden">
                    <div className="p-8 flex-1 overflow-y-auto">
                      <div className="flex justify-between items-end mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Order Manifest</h3>
                        <span className="text-[10px] font-black">{orderItems.length} Entities</span>
                      </div>

                      {orderItems.length > 0 ? (
                        <div className="space-y-3">
                          {orderItems.map(item => (
                            <div key={item.skuId} className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 group">
                              <div className="flex-1">
                                <p className="text-xs font-black tracking-tight">{item.name}</p>
                                <p className="text-[9px] font-bold opacity-50 uppercase">{item.code}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <input 
                                  type="number" 
                                  value={item.quantity}
                                  onChange={(e) => updateQty(item.skuId, parseInt(e.target.value))}
                                  className="w-12 bg-secondary border border-border rounded-lg p-1 text-xs font-black text-center"
                                />
                                <div className="text-right min-w-[60px]">
                                  <p className="text-xs font-black">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <button onClick={() => removeItem(item.skuId)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-64 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center p-8">
                          <Package className="w-8 h-8 opacity-10 mb-4" />
                          <p className="text-xs font-bold text-muted-foreground">Manifest is currently empty.<br />Add SKUs from the left panel.</p>
                        </div>
                      )}
                    </div>

                    <div className="p-8 bg-black/20 border-t border-border space-y-6">
                      <div className="flex justify-between items-center font-black">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">Settlement Total</span>
                        <span className="text-3xl tracking-tighter">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <button 
                        onClick={handleSubmit}
                        disabled={!selectedCustomer || orderItems.length === 0 || isPending}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                      >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Commit Transaction
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

