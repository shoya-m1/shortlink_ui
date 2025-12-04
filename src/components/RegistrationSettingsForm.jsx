import React from 'react';
import { UserPlus, Save, Loader } from 'lucide-react';

export default function RegistrationSettingsForm({ settings, saving, onChange, onSubmit }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Pengaturan Registrasi</h2>
                    <p className="text-sm text-gray-500">Kontrol pendaftaran pengguna baru</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Toggle Switch */}
                <div className="flex items-center justify-between">
                    <span className="flex-grow flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Izinkan Pendaftaran Baru</span>
                        <span className="text-sm text-gray-500">Jika dimatikan, user baru tidak bisa mendaftar via form atau Google.</span>
                    </span>
                    <button
                        type="button"
                        onClick={() => onChange('enabled', !settings.enabled)}
                        className={`${settings.enabled ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        role="switch"
                        aria-checked={settings.enabled}
                    >
                        <span
                            aria-hidden="true"
                            className={`${settings.enabled ? 'translate-x-5' : 'translate-x-0'
                                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                    </button>
                </div>

                {/* Message Input */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Pesan Penolakan (Jika Ditutup)
                    </label>
                    <input
                        type="text"
                        id="message"
                        value={settings.message || ''}
                        onChange={(e) => onChange('message', e.target.value)}
                        className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Contoh: Pendaftaran sedang ditutup sementara."
                        disabled={settings.enabled} // Optional: disable message input if enabled
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-50 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {saving ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Simpan Perubahan
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
