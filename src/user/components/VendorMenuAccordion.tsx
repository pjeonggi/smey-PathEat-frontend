// Accordion menu list grouped by category — extracted from VendorDetail.

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Utensils, ChevronDown, ChevronUp } from "lucide-react";

/**
 * @param {{ menu: {name:string, price:number, desc?:string, category?:string}[], colors: object }} props
 */
export function VendorMenuAccordion({ menu, colors: c }) {
  const [open, setOpen] = useState(new Set(["Main"]));

  const grouped = menu.reduce((acc, item) => {
    const cat = item.category ?? "Menu";
    acc[cat] = [...(acc[cat] ?? []), item];
    return acc;
  }, {});

  function toggle(cat) {
    setOpen((prev) => {
      const n = new Set(prev);
      n.has(cat) ? n.delete(cat) : n.add(cat);
      return n;
    });
  }

  return (
    <div>
      <h3
        className="text-sm font-semibold mb-3 flex items-center gap-2"
        style={{ color: c.textMid }}
      >
        <Utensils size={13} className="text-amber-400" /> Menu
      </h3>
      <div className="space-y-2">
        {Object.entries(grouped).map(([cat, items]) => (
          <div
            key={cat}
            className="rounded-xl overflow-hidden"
            style={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: c.scoreCardBorder,
            }}
          >
            <button
              onClick={() => toggle(cat)}
              className="w-full flex items-center justify-between px-3 py-2.5"
              style={{ background: c.scoreCard }}
            >
              <span
                className="text-[12px] font-semibold"
                style={{ color: c.text }}
              >
                {cat}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: c.textDim }}>
                  {items.length} items
                </span>
                {open.has(cat) ? (
                  <ChevronUp size={13} style={{ color: c.textDim }} />
                ) : (
                  <ChevronDown size={13} style={{ color: c.textDim }} />
                )}
              </div>
            </button>
            <AnimatePresence initial={false}>
              {open.has(cat) && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 px-3 py-2.5"
                      style={{
                        borderTopWidth: 1,
                        borderTopStyle: "solid",
                        borderTopColor: c.rowBorder,
                      }}
                    >
                      <div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: c.text }}
                        >
                          {item.name}
                        </div>
                        {item.desc && (
                          <div
                            className="text-xs mt-0.5"
                            style={{ color: c.textFaint }}
                          >
                            {item.desc}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold shrink-0 text-emerald-400">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
