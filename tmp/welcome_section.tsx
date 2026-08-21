                    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

                        {/* Row 1: Tsania Latheefa — Video Testimoni (full width) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <img 
                                    src="/assets/tsan-thumb.webp" 
                                    alt="Tsania Latheefa" 
                                    loading="lazy"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Tsania Latheefa</h3>
                                    <p className="text-sm text-slate-500 font-medium">Content Creator • 52.8K Followers</p>
                                </div>
                            </div>
                            <blockquote className="text-xl font-bold text-slate-900 leading-snug mb-4">
                                <span className="text-slate-400">"</span>
                                Omset Naik dari Rp20 Juta → <span className="text-emerald-500">Rp30 Juta</span> per bulan.
                                <span className="text-slate-400">"</span>
                            </blockquote>
                            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                                    <iframe
                                        src="https://player.mediadelivery.net/embed/701292/623975dd-1d66-41c8-8aac-07a07c141d21?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
                                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
                                        allowFullScreen
                                        style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }}
                                    />
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-slate-500 font-medium text-center">
                                Video testimoni setelah optimasi landing page
                            </p>
                        </div>

                        {/* Row 2: 2 columns — Mas Ardi (left) + Testimoni Baru (right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Card: Mas Ardi */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Mas Ardi</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-4">Klien PBM Agency</p>
                                    <blockquote className="text-xl font-bold text-slate-900 leading-snug mb-4">
                                        <span className="text-slate-400">"</span>
                                        ROAS Iklan Naik Drastis Menjadi <span className="text-indigo-600">5.0x</span>
                                        <span className="text-slate-400">"</span>
                                    </blockquote>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        Volume purchase meningkat tajam yang langsung terlihat dari metrik checkout landing page. Dikonfirmasi langsung oleh klien bahwa kenaikan ini jauh melebihi rata-rata pola musiman (seasonal) biasa.
                                    </p>
                                </div>
                                <div className="mt-5 bg-slate-100 rounded-2xl p-3 border border-slate-200 shadow-inner">
                                    <img 
                                        src="/assets/fullbright.webp" 
                                        alt="Bukti Chat Mas Ardi" 
                                        loading="lazy"
                                        className="w-full rounded-xl shadow-sm object-cover"
                                    />
                                </div>
                            </div>

                            {/* Card: Testimoni WA + Bukti (digabung) */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Testimoni Klien via WhatsApp</h3>
                                </div>
                                <div className="flex justify-center mb-4">
                                    <img 
                                        src="/assets/newtestimoni.jpeg" 
                                        alt="Screenshot testimoni WhatsApp klien" 
                                        loading="lazy"
                                        className="w-full max-w-[280px] rounded-2xl border border-slate-200 shadow-md object-contain"
                                    />
                                </div>
                                <div className="border-t border-slate-100 pt-4 mt-auto">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm font-bold text-slate-900">Bukti Hasil Kenaikan</span>
                                    </div>
                                    <img 
                                        src="/assets/buktinew.jpeg" 
                                        alt="Bukti hasil kenaikan performa" 
                                        loading="lazy"
                                        className="w-full rounded-xl border border-slate-200 shadow-sm object-contain"
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
