

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatItem {
    label: string;
    value: string;
    subtext: string;
    change: string | null;
    changeType: 'positive' | 'warning' | 'neutral';
    icon: LucideIcon;
    gradient: string;
}

interface StackedCarouselProps {
    items: StatItem[];
}

export function StackedCarousel({ items }: StackedCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [exitX, setExitX] = useState<number | null>(null);

    const removeCard = (direction: 'left' | 'right') => {
        setExitX(direction === 'right' ? 200 : -200); // Fly off distance
        setTimeout(() => {
            setExitX(null); // Reset exit state
            setActiveIndex((prev) => (prev + 1) % items.length); // Cycle next
        }, 200); // Wait for transition to "feel" complete before snapping back
    };

    // Calculate card properties based on its position in the stack
    const getCardStyle = (index: number) => {
        // Effective index logic for wrapping:
        // We want 0 (Front), 1 (Back), 2 (Back)...
        const offset = (index - activeIndex + items.length) % items.length;

        // Front Card
        if (offset === 0) {
            return {
                scale: 1,
                y: 0,
                zIndex: 30, // Highest
                opacity: 1,
                rotate: 0,
                drag: 'x' as const
            };
        }

        // Exiting Card (Special State)
        // Note: strictly speaking, valid offsets are 1..N-1
        // But if we handle 'exit' via AnimatePresence activeIndex, we don't need this block here 
        // because the key handles it. We just need stack logic.

        // Stacked Cards (up to 2 visible behind)
        if (offset <= 2) {
            return {
                scale: 1 - offset * 0.05, // 0.95, 0.90
                y: -15 * offset, // -15px, -30px
                zIndex: 30 - offset, // 29, 28
                opacity: 1 - offset * 0.1, // 0.9, 0.8
                rotate: 0,
                drag: false
            };
        }

        // Hidden Cards (Bottom of stack)
        return {
            scale: 0.85,
            y: -45,
            zIndex: 0,
            opacity: 0,
            rotate: 0,
            drag: false
        };
    };

    return (
        <div className="relative w-full h-[240px] flex items-end justify-center perspective-1000 pb-4">
            {/* Iterate all items, but render them absolutely positioned */}
            {items.map((item, index) => {
                const style = getCardStyle(index);
                const isFront = (index - activeIndex + items.length) % items.length === 0;

                // Exit animation override
                // If this is the Front card AND we triggered text exitX
                const isExiting = isFront && exitX !== null;

                return (
                    <motion.div
                        key={item.label}
                        className={`absolute w-[95%] max-w-[450px] bg-white rounded-[24px] border border-gray-100 p-5 flex flex-col justify-between h-[190px] shadow-xl origin-bottom`}
                        initial={false}
                        animate={{
                            scale: isExiting ? 1 : style.scale,
                            y: isExiting ? 0 : style.y,
                            x: isExiting ? (exitX || 0) * 1.5 : 0, // Fly off
                            opacity: isExiting ? 0 : style.opacity,
                            zIndex: style.zIndex,
                            rotate: isExiting ? (exitX || 0) * 0.1 : 0 // Tilt on exit
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                        drag={isFront ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.6}
                        onDragEnd={(e, info) => {
                            if (!isFront) return;
                            if (info.offset.x > 100) removeCard('right');
                            else if (info.offset.x < -100) removeCard('left');
                        }}
                        style={{
                            // Apply subtle static shadow for stack effect
                            boxShadow: isFront ? '0 20px 40px -10px rgba(0,0,0,0.15)' : '0 10px 20px -5px rgba(0,0,0,0.05)',
                        }}
                    >
                        {/* Content */}
                        <div className="flex items-start justify-between mb-2">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md`}>
                                <item.icon className="w-5 h-5 text-white" />
                            </div>
                            {item.change && (
                                <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full ${item.changeType === 'warning' ? 'bg-orange-50/50 border border-orange-100' : 'bg-emerald-50/50 border border-emerald-100'
                                    }`}>
                                    <span className={`text-xs font-bold tracking-wide ${item.changeType === 'warning' ? 'text-orange-600' : 'text-emerald-600'
                                        }`}>
                                        {item.change}
                                    </span>
                                </div>
                            )}
                            {item.changeType === 'warning' && !item.change && (
                                <div className="flex items-center gap-1 bg-orange-100 px-2.5 py-1.5 rounded-full">
                                    <span className="text-xs font-bold text-orange-700 tracking-wide">Due</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className={`text-3xl font-extrabold mb-1 tracking-tight ${item.changeType === 'warning' ? 'text-orange-600' : 'text-[#1A1D1F]'}`}>
                                {item.value}
                            </div>
                            <div className="text-sm font-bold text-gray-800 mb-0.5">
                                {item.label}
                            </div>
                            <div className="text-xs font-medium text-gray-400">
                                {item.subtext}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
