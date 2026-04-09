import { useState } from "react";
import { useDbCities, DbCity } from "@/hooks/useCities";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, X, Activity } from "lucide-react";
import { toast } from "sonner";

const emptyCity: Omit<DbCity, "sort_order"> = {
  id: "",
  name: "",
  country: "",
  lat: 0,
  lng: 0,
  connection_type: "story",
  connection_name: null,
  connection_tagline: null,
  connection_description: "",
  connection_description_es: null,
  connection_emoji: "📍",
  connection_url: null,
  fun_fact: "",
  fun_fact_es: null,
};

export default function AdminCities() {
  const { data: cities, isLoading } = useDbCities();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<DbCity | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleNew = () => {
    setEditing({ ...emptyCity, sort_order: (cities?.length || 0) + 1 } as DbCity);
    setIsNew(true);
  };

  const handleEdit = (city: DbCity) => {
    setEditing({ ...city });
    setIsNew(false);
  };

  const handleCancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.id || !editing.name || !editing.country || !editing.connection_description || !editing.fun_fact) {
      toast.error("Please fill in all required fields (ID, Name, Country, Description, Fun Fact)");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const { error } = await supabase.from("cities").insert({
          id: editing.id,
          name: editing.name,
          country: editing.country,
          lat: editing.lat,
          lng: editing.lng,
          connection_type: editing.connection_type,
          connection_name: editing.connection_name,
          connection_tagline: editing.connection_tagline,
          connection_description: editing.connection_description,
          connection_description_es: editing.connection_description_es,
          connection_emoji: editing.connection_emoji,
          connection_url: editing.connection_url,
          fun_fact: editing.fun_fact,
          fun_fact_es: editing.fun_fact_es,
          sort_order: editing.sort_order,
        });
        if (error) throw error;
        toast.success("City added!");
      } else {
        const { error } = await supabase.from("cities").update({
          name: editing.name,
          country: editing.country,
          lat: editing.lat,
          lng: editing.lng,
          connection_type: editing.connection_type,
          connection_name: editing.connection_name,
          connection_tagline: editing.connection_tagline,
          connection_description: editing.connection_description,
          connection_description_es: editing.connection_description_es,
          connection_emoji: editing.connection_emoji,
          connection_url: editing.connection_url,
          fun_fact: editing.fun_fact,
          fun_fact_es: editing.fun_fact_es,
          sort_order: editing.sort_order,
        }).eq("id", editing.id);
        if (error) throw error;
        toast.success("City updated!");
      }
      qc.invalidateQueries({ queryKey: ["cities"] });
      qc.invalidateQueries({ queryKey: ["cities-raw"] });
      handleCancel();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this city?")) return;
    setDeleting(id);
    try {
      const { error } = await supabase.from("cities").delete().eq("id", id);
      if (error) throw error;
      toast.success("City deleted");
      qc.invalidateQueries({ queryKey: ["cities"] });
      qc.invalidateQueries({ queryKey: ["cities-raw"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Activity className="w-5 h-5 animate-pulse text-primary mr-2" />
        <span className="font-mono text-sm text-muted-foreground">Loading cities...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          {cities?.length || 0} cities in database
        </span>
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-primary/20 border border-primary/40 text-primary font-mono text-xs uppercase tracking-wider hover:bg-primary/30 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add City
        </button>
      </div>

      {/* Edit/Add Form */}
      {editing && (
        <div className="glow-border hud-corners rounded-md bg-card p-5 mb-6 animate-fade-in">
          <h4 className="font-display font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
            {isNew ? "Add New City" : `Edit: ${editing.name}`}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="ID (slug)" value={editing.id} disabled={!isNew}
              onChange={(v) => setEditing({ ...editing, id: v })} />
            <Field label="Name" value={editing.name}
              onChange={(v) => setEditing({ ...editing, name: v })} />
            <Field label="Country" value={editing.country}
              onChange={(v) => setEditing({ ...editing, country: v })} />
            <Field label="Emoji" value={editing.connection_emoji}
              onChange={(v) => setEditing({ ...editing, connection_emoji: v })} />
            <Field label="Latitude" value={String(editing.lat)} type="number"
              onChange={(v) => setEditing({ ...editing, lat: parseFloat(v) || 0 })} />
            <Field label="Longitude" value={String(editing.lng)} type="number"
              onChange={(v) => setEditing({ ...editing, lng: parseFloat(v) || 0 })} />
            <Field label="Connection Type" value={editing.connection_type}
              onChange={(v) => setEditing({ ...editing, connection_type: v })} />
            <Field label="Connection URL" value={editing.connection_url || ""}
              onChange={(v) => setEditing({ ...editing, connection_url: v || null })} />
            <Field label="Sort Order" value={String(editing.sort_order)} type="number"
              onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v) || 0 })} />
          </div>
          <div className="mt-3 space-y-3">
            <TextArea label="Description (EN) *" value={editing.connection_description}
              onChange={(v) => setEditing({ ...editing, connection_description: v })} />
            <TextArea label="Description (ES)" value={editing.connection_description_es || ""}
              onChange={(v) => setEditing({ ...editing, connection_description_es: v || null })} />
            <TextArea label="Fun Fact (EN) *" value={editing.fun_fact}
              onChange={(v) => setEditing({ ...editing, fun_fact: v })} />
            <TextArea label="Fun Fact (ES)" value={editing.fun_fact_es || ""}
              onChange={(v) => setEditing({ ...editing, fun_fact_es: v || null })} />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-3 h-3" /> {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-secondary border border-border text-muted-foreground font-mono text-xs uppercase tracking-wider hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cities List */}
      <div className="space-y-2">
        {cities?.map((city) => (
          <div
            key={city.id}
            className="glow-border rounded-md bg-card p-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl">{city.connection_emoji}</span>
              <div className="min-w-0">
                <div className="font-display font-semibold text-sm text-foreground truncate">{city.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {city.country} · {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}° · order: {city.sort_order}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleEdit(city)}
                className="p-1.5 rounded-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(city.id)}
                disabled={deleting === city.id}
                className="p-1.5 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", disabled = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-8 px-2 rounded-sm bg-secondary/50 border border-border font-mono text-xs text-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full px-2 py-1.5 rounded-sm bg-secondary/50 border border-border font-mono text-xs text-foreground focus:outline-none focus:border-primary/50 resize-y"
      />
    </div>
  );
}
